<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$dataFile = 'data.json';

// Utility to read JSON file
function readData($file) {
    if (!file_exists($file)) {
        return ["flavors" => [], "categories" => []];
    }
    $content = file_get_contents($file);
    return json_decode($content, true);
}

// Utility to write JSON file
function writeData($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

$data = readData($dataFile);

switch ($method) {
    case 'GET':
        if ($action === 'get_all') {
            echo json_encode($data);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid action"]);
        }
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);

        if ($action === 'add_flavor') {
            $input['id'] = uniqid();
            $data['flavors'][] = $input;
            writeData($dataFile, $data);
            echo json_encode(["status" => "success", "item" => $input]);
        } elseif ($action === 'add_category') {
            $newItem = [
                "id" => uniqid(),
                "name" => $input['name']
            ];
            $data['categories'][] = $newItem;
            writeData($dataFile, $data);
            echo json_encode(["status" => "success", "item" => $newItem]);
        }
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);

        if ($action === 'update_flavor') {
            foreach ($data['flavors'] as &$flavor) {
                if ($flavor['id'] === $input['id']) {
                    $flavor = array_merge($flavor, $input);
                    break;
                }
            }
            writeData($dataFile, $data);
            echo json_encode(["status" => "success"]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if ($action === 'delete_flavor' && $id) {
            $data['flavors'] = array_values(array_filter($data['flavors'], fn($f) => $f['id'] !== $id));
            writeData($dataFile, $data);
            echo json_encode(["status" => "success"]);
        } elseif ($action === 'delete_category' && $id) {
            $data['categories'] = array_values(array_filter($data['categories'], fn($c) => $c['id'] !== $id));
            writeData($dataFile, $data);
            echo json_encode(["status" => "success"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
?>
