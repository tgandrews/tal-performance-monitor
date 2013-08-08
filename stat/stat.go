package stat

import (
	"net/http"
	"log"
)

type Stat struct {
	userAgent string
	ipAddr string
	name string
	value string
}

func (s *Stat) FromRequest(request *http.Request) {
	log.Print("Stats hello")	
}