package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"./stat"
	"github.com/tgandrews/gostats"

	"labix.org/v2/mgo"
)

const (
	MONGODB_DATABASE         string = "tpm"
	MONGODB_STATS_COLLECTION string = "application_stats"
)

var statsdClient *gostats.StatsdClient
var mongoDB *mgo.Database

var verbose bool
var port int
var sendToStatsD bool

func main() {
	flag.IntVar(&port, "port", 3000, "Port for the server to listen")
	flag.BoolVar(&verbose, "verbose", false, "Set true to see all stats received")
	flag.BoolVar(&sendToStatsD, "statsd", false, "Set to true to send stats to StatsD")
	flag.Parse()

	if verbose {
		log.Println("Verbose log mode enabled")
	}
	if sendToStatsD {
		log.Println("Sending to StatsD enabled")
	}

	convertedPort := ":" + strconv.Itoa(port)
	log.Printf("Starting server on port %s", convertedPort)
	http.HandleFunc("/", handleRequest)

	if sendToStatsD {
		statsdClient = gostats.New("localhost", 8125)
	}

	mongodbSession, err := mgo.Dial("localhost")
	if err != nil {
		panic(err)
	}
	defer mongodbSession.Close()

	mongoDB = mongodbSession.DB(MONGODB_DATABASE)

	log.Fatal(http.ListenAndServe(convertedPort, nil))
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
	stat := stat.FromRequest(r)
	if verbose {
		log.Println(stat.String())
	}

	if sendToStatsD {
		statsdClient.Timing(stat.Name, int64(stat.Value))
	}

	statsCollection := mongoDB.C(MONGODB_STATS_COLLECTION)

	err := statsCollection.Insert(stat)
	if err != nil {
		log.Println(err)
	}
	if verbose {
		log.Printf("Stat written to MongoDB %s.%s", MONGODB_DATABASE, MONGODB_STATS_COLLECTION)
	}

	w.Header().Set("Content-Type", "text/javascript; charset=utf-8")
	fmt.Fprintf(w, ";")
}
