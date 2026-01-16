<?php
/**
 * API Router
 * API endpoint'lerini yönetmek
 */

require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/config/ApiResponse.php';
require_once __DIR__ . '/models/Translation.php';
require_once __DIR__ . '/models/Message.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// OPTIONS isteğini işle
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// URL'yi parse et
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$request_method = $_SERVER['REQUEST_METHOD'];

// API base'ini kaldır - hem /api/resource hem de /api/index.php?url=resource formatlarını destekle
$api_base = '/api/';
$route = '';

if (!empty($_GET['url'])) {
    $route = $_GET['url'];
} else {
    $route = str_replace($api_base, '', $request_uri);
}

$parts = explode('/', trim($route, '/'));
$resource = $parts[0] ?? '';
$id = $parts[1] ?? '';

// POST/PUT verilerini al
$input = json_decode(file_get_contents('php://input'), true);

// Routing
switch ($resource) {
    case 'translations':
        handleTranslations($request_method, $id, $input);
        break;

    case 'messages':
        handleMessages($request_method, $id, $input);
        break;

    case 'stats':
        handleStats($request_method);
        break;

    case 'init':
        handleInit();
        break;

    default:
        echo ApiResponse::error('Endpoint bulunamadı', 404);
        break;
}

/**
 * Çeviriler endpoint
 */
function handleTranslations($method, $id, $input) {
    $translation = new Translation();

    switch ($method) {
        case 'GET':
            if ($id) {
                // Tek çeviriyi al
                $data = $translation->getById($id);
                if ($data) {
                    echo ApiResponse::success($data);
                } else {
                    echo ApiResponse::error('Çeviri bulunamadı', 404);
                }
            } else {
                // Tüm çevirileri al
                $page = $_GET['page'] ?? 1;
                $per_page = $_GET['per_page'] ?? 10;
                $result = $translation->getAll($page, $per_page);
                
                echo ApiResponse::paginated(
                    $result['items'],
                    $result['total'],
                    $page,
                    $per_page,
                    'Çeviriler başarıyla alındı'
                );
            }
            break;

        case 'POST':
            if (!isset($input['key'])) {
                echo ApiResponse::error('Key zorunludur', 400);
                break;
            }
            
            $result = $translation->add(
                $input['key'],
                $input['tr'] ?? '',
                $input['en'] ?? '',
                $input['ar'] ?? '',
                $input['ru'] ?? ''
            );
            
            if ($result['success']) {
                echo ApiResponse::success(['id' => $result['id']], $result['message']);
            } else {
                echo ApiResponse::error($result['message'], 400);
            }
            break;

        case 'PUT':
            if (!$id) {
                echo ApiResponse::error('ID gerekli', 400);
                break;
            }

            $result = $translation->update(
                $id,
                $input['tr'] ?? null,
                $input['en'] ?? null,
                $input['ar'] ?? null,
                $input['ru'] ?? null
            );

            if ($result['success']) {
                echo ApiResponse::success(null, $result['message']);
            } else {
                echo ApiResponse::error($result['message'], 400);
            }
            break;

        case 'DELETE':
            if (!$id) {
                echo ApiResponse::error('ID gerekli', 400);
                break;
            }

            $result = $translation->delete($id);
            if ($result['success']) {
                echo ApiResponse::success(null, $result['message']);
            } else {
                echo ApiResponse::error($result['message'], 400);
            }
            break;
    }
}

/**
 * Mesajlar endpoint
 */
function handleMessages($method, $id, $input) {
    $message = new Message();

    switch ($method) {
        case 'GET':
            if ($id) {
                // Tek mesajı al
                $data = $message->getById($id);
                if ($data) {
                    echo ApiResponse::success($data);
                } else {
                    echo ApiResponse::error('Mesaj bulunamadı', 404);
                }
            } else {
                // Tüm mesajları al
                $page = $_GET['page'] ?? 1;
                $per_page = $_GET['per_page'] ?? 10;
                $status = $_GET['status'] ?? null;
                $result = $message->getAll($page, $per_page, $status);
                
                echo ApiResponse::paginated(
                    $result['items'],
                    $result['total'],
                    $page,
                    $per_page,
                    'Mesajlar başarıyla alındı'
                );
            }
            break;

        case 'POST':
            if (!isset($input['name'], $input['email'], $input['message'])) {
                echo ApiResponse::error('Zorunlu alanları doldurun', 400);
                break;
            }

            $result = $message->add(
                $input['name'],
                $input['email'],
                $input['phone'] ?? '',
                $input['service'] ?? '',
                $input['message']
            );

            if ($result['success']) {
                echo ApiResponse::success(['id' => $result['id']], $result['message']);
            } else {
                echo ApiResponse::error($result['message'], 400);
            }
            break;

        case 'PUT':
            if (!$id) {
                echo ApiResponse::error('ID gerekli', 400);
                break;
            }

            if (isset($input['status'])) {
                $result = $message->updateStatus($id, $input['status']);
                if ($result['success']) {
                    echo ApiResponse::success(null, $result['message']);
                } else {
                    echo ApiResponse::error($result['message'], 400);
                }
            }
            break;

        case 'DELETE':
            if (!$id) {
                echo ApiResponse::error('ID gerekli', 400);
                break;
            }

            $result = $message->delete($id);
            if ($result['success']) {
                echo ApiResponse::success(null, $result['message']);
            } else {
                echo ApiResponse::error($result['message'], 400);
            }
            break;
    }
}

/**
 * İstatistikler endpoint
 */
function handleStats($method) {
    if ($method !== 'GET') {
        echo ApiResponse::error('Sadece GET desteklenir', 405);
        return;
    }

    $message = new Message();
    $db = new Database();
    $conn = $db->getConnection();

    try {
        $stats = [
            'total_projects' => 150,
            'unread_messages' => $message->getUnreadCount(),
            'active_users' => 12,
            'satisfaction_rate' => 98
        ];

        echo ApiResponse::success($stats, 'İstatistikler alındı');
    } catch (Exception $e) {
        echo ApiResponse::error('İstatistikler alınamadı', 500);
    }
}

/**
 * Veritabanı başlatma endpoint
 */
function handleInit() {
    try {
        Database::initializeTables();
        echo ApiResponse::success(null, 'Veritabanı başarıyla başlatıldı');
    } catch (Exception $e) {
        echo ApiResponse::error('Başlatma hatası: ' . $e->getMessage(), 500);
    }
}
