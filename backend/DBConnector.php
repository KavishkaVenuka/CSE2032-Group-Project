<?php
    class DBConnector {

        //Used the singleton - [creational] design pattern...
        //defining the DB instance be eihter type of DBConnector or null...
        private static ?DBConnector $DBInstance = null;

        //defining the PHP Data Object instance...
        private PDO $conn;

        //databse credentials..
        private $host = 'localhost';
        private $dbName = 'job_cgu';
        private $username = 'root';
        private $password = ''; //Change the password to your own password...


        private function __construct () {
            try {
            $dsn = "mysql:host=$this->host;dbname=$this->dbName;charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->username, $this->password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);

            } catch (PDOException $e) {
                die("PDO Connection failed: " . $e->getMessage());
            }

        }

        //this function returns the instance that is capable of executing queries in databse...
        public static function getDBInstance() : PDO {
            if (self::$DBInstance == null) {
                self::$DBInstance = new DBConnector();
            }
            
            //returning the conn attribute of the DBConnector class...
            return self::$DBInstance->conn;
            
        }

    }
?>