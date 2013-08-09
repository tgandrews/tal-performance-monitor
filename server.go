package main

import (
	"log"
	"net/http"
	"strconv"

	"github.com/tgandrews/tal-performance-monitor/stat"
	"github.com/tgandrews/gostats"
)

var statsdClient *gostats.StatsdClient


func main() {
	port := 3000
	convertedPort := ":" + strconv.Itoa(port)
	log.Printf("Starting server on port %s", convertedPort)
	http.HandleFunc("/", handleRequest)
	statsdClient = gostats.New("localhost", 8125)
	log.Fatal(http.ListenAndServe(convertedPort, nil))
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
	stat := stat.FromRequest(r)
	log.Println(stat.String())
	log.Println("Sending stat to statsd")
	statsdClient.Timing(stat.Name, int64(stat.Value))
	log.Println("Timing sent to statsd")
}