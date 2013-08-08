package stat

import (
	"log"
	"net/http"
	"net/url"
	"strconv"
)

type Stat struct {
	Name      string
	Value     int
	UserAgent string
	IpAddr    string
}

func FromRequest(request *http.Request) (s Stat) {
	s = Stat{}
	s.UserAgent = request.Header["User-Agent"][0]
	queryParameters, _ := url.ParseQuery(request.URL.RawQuery)
	for name, _ := range queryParameters {
		if name != "onload" {
			continue
		}

		s.Name = "onload"
		rawValue := queryParameters[name][0]
		parsedInt, err := strconv.ParseInt(rawValue, 10, 64)
		if err != nil {
			log.Print(err)
		}
		s.Value = int(parsedInt)
	}
	return s
}
