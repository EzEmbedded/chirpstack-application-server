// +build !windows

package cmd

import (
	"log/syslog"

	"hub.fastgit.org/pkg/errors"
	log "hub.fastgit.org/sirupsen/logrus"
	lsyslog "hub.fastgit.org/sirupsen/logrus/hooks/syslog"

	"hub.fastgit.org/brocaar/chirpstack-application-server/internal/config"
)

func setSyslog() error {
	if !config.C.General.LogToSyslog {
		return nil
	}

	var prio syslog.Priority

	switch log.StandardLogger().Level {
	case log.DebugLevel:
		prio = syslog.LOG_USER | syslog.LOG_DEBUG
	case log.InfoLevel:
		prio = syslog.LOG_USER | syslog.LOG_INFO
	case log.WarnLevel:
		prio = syslog.LOG_USER | syslog.LOG_WARNING
	case log.ErrorLevel:
		prio = syslog.LOG_USER | syslog.LOG_ERR
	case log.FatalLevel:
		prio = syslog.LOG_USER | syslog.LOG_CRIT
	case log.PanicLevel:
		prio = syslog.LOG_USER | syslog.LOG_CRIT
	}

	hook, err := lsyslog.NewSyslogHook("", "", prio, "chirpstack-application-server")
	if err != nil {
		return errors.Wrap(err, "get syslog hook error")
	}

	log.AddHook(hook)

	return nil
}
