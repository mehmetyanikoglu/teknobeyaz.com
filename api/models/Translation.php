<?php
/**
 * Translation Model
 * Çeviriler için veritabanı işlemleri
 */

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/ApiResponse.php';

class Translation {
    private $conn;
    private $table = 'translations';

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    /**
     * Tüm çevirileri al
     */
    public function getAll($page = 1, $per_page = 10) {
        try {
            $offset = ($page - 1) * $per_page;
            
            // Toplam sayı
            $total_result = $this->conn->query("SELECT COUNT(*) FROM {$this->table}");
            $total = $total_result->fetchColumn();

            // Veriler
            $query = "SELECT * FROM {$this->table} LIMIT :limit OFFSET :offset";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':limit', $per_page, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();

            return [
                'items' => $stmt->fetchAll(PDO::FETCH_ASSOC),
                'total' => $total
            ];
        } catch (Exception $e) {
            return ['items' => [], 'total' => 0, 'error' => $e->getMessage()];
        }
    }

    /**
     * Çeviriyi ID'ye göre al
     */
    public function getById($id) {
        try {
            $query = "SELECT * FROM {$this->table} WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Çeviriyi anahtara göre al
     */
    public function getByKey($key) {
        try {
            $query = "SELECT * FROM {$this->table} WHERE `key` = :key";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':key', $key, PDO::PARAM_STR);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Çeviri ekle
     */
    public function add($key, $tr, $en, $ar, $ru) {
        try {
            // Validasyon
            if (empty($key)) {
                return ['success' => false, 'message' => 'Anahtar zorunludur'];
            }

            $query = "INSERT INTO {$this->table} (`key`, tr, en, ar, ru) 
                     VALUES (:key, :tr, :en, :ar, :ru)";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':key', $key);
            $stmt->bindParam(':tr', $tr);
            $stmt->bindParam(':en', $en);
            $stmt->bindParam(':ar', $ar);
            $stmt->bindParam(':ru', $ru);

            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Çeviri başarıyla eklendi',
                    'id' => $this->conn->lastInsertId()
                ];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Çeviri güncelle
     */
    public function update($id, $tr = null, $en = null, $ar = null, $ru = null) {
        try {
            $updates = [];
            $params = [':id' => $id];

            if ($tr !== null) {
                $updates[] = "tr = :tr";
                $params[':tr'] = $tr;
            }
            if ($en !== null) {
                $updates[] = "en = :en";
                $params[':en'] = $en;
            }
            if ($ar !== null) {
                $updates[] = "ar = :ar";
                $params[':ar'] = $ar;
            }
            if ($ru !== null) {
                $updates[] = "ru = :ru";
                $params[':ru'] = $ru;
            }

            if (empty($updates)) {
                return ['success' => false, 'message' => 'Güncellenecek alan yok'];
            }

            $updates[] = "updated_at = CURRENT_TIMESTAMP";
            $query = "UPDATE {$this->table} SET " . implode(', ', $updates) . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);

            foreach ($params as $key => $value) {
                $stmt->bindParam($key, $params[$key]);
            }

            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Çeviri başarıyla güncellendi'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Çeviri sil
     */
    public function delete($id) {
        try {
            $query = "DELETE FROM {$this->table} WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Çeviri başarıyla silindi'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Tüm çevirileri JSON olarak al
     */
    public function getAllAsJson($language = 'tr') {
        try {
            $query = "SELECT key, {$language} as translation FROM {$this->table}";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            $result = [];
            foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
                $keys = explode('.', $row['key']);
                $ref = &$result;
                foreach ($keys as $k) {
                    if (!isset($ref[$k])) {
                        $ref[$k] = [];
                    }
                    $ref = &$ref[$k];
                }
                $ref = $row['translation'];
            }

            return $result;
        } catch (Exception $e) {
            return [];
        }
    }
}
