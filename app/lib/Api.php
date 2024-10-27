<?php


    class Api {

        private $base_url = "http://localhost:9000/api";
        private $curl;
        private $method;
        private $endpoint;
        private $data;
        private $url;

        public $result = false;


        public function __construct($endpoint, $method = 'GET',  $data = false){
            $this->curl = curl_init();
            $this->$method = $method;
            $this->endpoint = $endpoint;
            $this->data = $data;
            $this->url = $this->base_url . $endpoint;
        }

        public function callApi(){
            try {
                $this->request();
            } catch (\Throwable $th) {
                //throw $th;
                $result = false;
            }
        }


        public function request(){  

            switch ($this->method){
                case "POST":
                    curl_setopt($this->curl, CURLOPT_POST, 1);
                    if ($this->data)
                        curl_setopt($this->curl, CURLOPT_POSTFIELDS, json_encode($this->data));
                    break;
                case "PUT":
                    curl_setopt($this->curl, CURLOPT_CUSTOMREQUEST, "PUT");
                    if ($this->data)
                        curl_setopt($this->curl, CURLOPT_POSTFIELDS, $this->data);			 					
                    break;
                case "DELETE":
                    curl_setopt($this->curl, CURLOPT_CUSTOMREQUEST, "DELETE");
                    if ($this->data)
                        curl_setopt($this->curl, CURLOPT_POSTFIELDS, $this->data);			 					
                    break;
                default: // GET
                    if ($this->data)
                        $url = sprintf("%s?%s", $url, http_build_query($this->data));
            }
            // OPTIONS:
            curl_setopt($this->curl, CURLOPT_URL, $url);
            curl_setopt($this->curl, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
            ));
            curl_setopt($this->curl, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($this->curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
            // EXECUTE:
            $this->result = curl_exec($this->curl);
           
            $this->close();
        }   

        public function close(){
            curl_close($this->curl);
        }

        public function getResult(){
            return $this->result;
        }
    }