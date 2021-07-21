package storage

import (
	"context"

	"hub.fastgit.org/gofrs/uuid"
	"hub.fastgit.org/jmoiron/sqlx"
	"hub.fastgit.org/pkg/errors"

	"hub.fastgit.org/brocaar/chirpstack-api/go/v3/ns"
	"hub.fastgit.org/brocaar/chirpstack-application-server/internal/backend/networkserver"
)

func getNSClientForServiceProfile(ctx context.Context, db sqlx.Queryer, id uuid.UUID) (ns.NetworkServerServiceClient, error) {
	n, err := GetNetworkServerForServiceProfileID(ctx, db, id)
	if err != nil {
		return nil, errors.Wrap(err, "get network-server error")
	}

	return getNSClient(n)
}

func getNSClientForMulticastGroup(ctx context.Context, db sqlx.Queryer, id uuid.UUID) (ns.NetworkServerServiceClient, error) {
	n, err := GetNetworkServerForMulticastGroupID(ctx, db, id)
	if err != nil {
		return nil, errors.Wrap(err, "get network-server error")
	}
	return getNSClient(n)
}

func getNSClientForApplication(ctx context.Context, db sqlx.Queryer, id int64) (ns.NetworkServerServiceClient, error) {
	n, err := GetNetworkServerForApplicationID(ctx, db, id)
	if err != nil {
		return nil, errors.Wrap(err, "get network-server error")
	}
	return getNSClient(n)
}

func getNSClient(n NetworkServer) (ns.NetworkServerServiceClient, error) {
	return networkserver.GetPool().Get(n.Server, []byte(n.CACert), []byte(n.TLSCert), []byte(n.TLSKey))
}
