package main

import (
	"log"
	"net/http"
	"strconv"

	"github.com/tgandrews/tal-performance-monitor/stat"
)

func main() {
	port := 3000
	convertedPort := ":" + strconv.Itoa(port)
	log.Printf("Starting server on port %s", convertedPort)
	http.HandleFunc("/", handleRequest)
	log.Fatal(http.ListenAndServe(convertedPort, nil))
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
	stat := stat.FromRequest(r)
	log.Println(stat.String())
}
