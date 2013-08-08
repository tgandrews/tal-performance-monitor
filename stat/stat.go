package stat

import (
	"log"
	"net/http"
	"net/url"
	"strconv"
)

const (
	BASE_TEN int = 10
	INTEGER_BIT_SIZE int = 64
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
		parsedInt, err := strconv.ParseInt(rawValue, BASE_TEN, INTEGER_BIT_SIZE)
		if err != nil {
			log.Print(err)
		}
		s.Value = int(parsedInt)
	}
	return s
}
