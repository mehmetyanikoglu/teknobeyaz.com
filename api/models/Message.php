<?php
/**
 * Message Model
 * İletişim formlarından gelen mesajlar
 */

require_once __DIR__ . '/../config/Database.php';

class Message {
    private $conn;
    private $table = 'messages';

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    /**
     * Tüm mesajları al
     */
    public function getAll($page = 1, $per_page = 10, $status = null) {
        try {
            $offset = ($page - 1) * $per_page;
            
            $where = '';
            if ($status) {
                $where = " WHERE status = '$status'";
            }

            // Toplam sayı
            $total_result = $this->conn->query("SELECT COUNT(*) FROM {$this->table}{$where}");
            $total = $total_result->fetchColumn();

            // Veriler
            $query = "SELECT * FROM {$this->table}{$where} ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':limit', $per_page, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();

            return [
                'items' => $stmt->fetchAll(PDO::FETCH_ASSOC),
                'total' => $total
            ];
        } catch (Exception $e) {
            return ['items' => [], 'total' => 0];
        }
    }

    /**
     * Mesajı al
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
     * Yeni mesaj ekle
     */
    public function add($name, $email, $phone, $service, $message) {
        try {
            // Validasyon
            if (empty($name) || empty($email) || empty($message)) {
                return ['success' => false, 'message' => 'Zorunlu alanları doldurun'];
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return ['success' => false, 'message' => 'Geçersiz e-posta'];
            }

            $query = "INSERT INTO {$this->table} (name, email, phone, service, message) 
                     VALUES (:name, :email, :phone, :service, :message)";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':phone', $phone);
            $stmt->bindParam(':service', $service);
            $stmt->bindParam(':message', $message);

            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Mesaj başarıyla gönderildi',
                    'id' => $this->conn->lastInsertId()
                ];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Mesaj durumunu güncelle
     */
    public function updateStatus($id, $status) {
        try {
            $query = "UPDATE {$this->table} SET status = :status, updated_at = CURRENT_TIMESTAMP WHERE id = :id";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':status', $status);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Durum güncellendi'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Mesajı sil
     */
    public function delete($id) {
        try {
            $query = "DELETE FROM {$this->table} WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Mesaj silindi'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Okunmamış mesaj sayısı
     */
    public function getUnreadCount() {
        try {
            $result = $this->conn->query("SELECT COUNT(*) FROM {$this->table} WHERE status = 'unread'");
            return $result->fetchColumn();
        } catch (Exception $e) {
            return 0;
        }
    }
}
