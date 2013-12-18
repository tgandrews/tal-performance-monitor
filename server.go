package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"./stat"
	"github.com/tgandrews/gostats"
)

var statsdClient *gostats.StatsdClient
var verbose bool
var port int

func main() {
	flag.IntVar(&port, "port", 3000, "Port for the server to listen")
	flag.BoolVar(&verbose, "verbose", false, "Set true to see all stats received")
	flag.Parse()

	convertedPort := ":" + strconv.Itoa(port)
	log.Printf("Starting server on port %s", convertedPort)
	http.HandleFunc("/", handleRequest)
	statsdClient = gostats.New("localhost", 8125)

	log.Fatal(http.ListenAndServe(convertedPort, nil))
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
	stat := stat.FromRequest(r)
	if verbose {
		log.Println(stat.String())
	}
	statsdClient.Timing(stat.Name, int64(stat.Value))

	w.Header().Set("Content-Type", "text/javascript; charset=utf-8")
	fmt.Fprintf(w, ";")
}
