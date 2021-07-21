// +build windows

package cmd

import (
	log "hub.fastgit.org/sirupsen/logrus"

	"hub.fastgit.org/brocaar/chirpstack-application-server/internal/config"
)

func setSyslog() error {
	if config.C.General.LogToSyslog {
		log.Fatal("syslog logging is not supported on Windows")
	}

	return nil
}
