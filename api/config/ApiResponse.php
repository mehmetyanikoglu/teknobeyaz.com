<?php
/**
 * API Response Handler
 * Standart API yanıtları döndürmek için
 */

class ApiResponse {
    /**
     * Başarılı yanıt
     */
    public static function success($data = null, $message = 'Başarılı', $code = 200) {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        
        return json_encode([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }

    /**
     * Hata yanıtı
     */
    public static function error($message = 'Bir hata oluştu', $code = 400, $data = null) {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        
        return json_encode([
            'success' => false,
            'message' => $message,
            'data' => $data,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }

    /**
     * Validasyon hatası
     */
    public static function validation($errors) {
        http_response_code(422);
        header('Content-Type: application/json; charset=utf-8');
        
        return json_encode([
            'success' => false,
            'message' => 'Validasyon hatası',
            'errors' => $errors,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }

    /**
     * Sayfalanmış veri
     */
    public static function paginated($items, $total, $page, $per_page, $message = 'Başarılı') {
        http_response_code(200);
        header('Content-Type: application/json; charset=utf-8');
        
        return json_encode([
            'success' => true,
            'message' => $message,
            'data' => $items,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'per_page' => $per_page,
                'pages' => ceil($total / $per_page)
            ],
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }
}
