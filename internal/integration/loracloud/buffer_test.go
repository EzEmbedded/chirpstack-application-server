package loracloud

import (
	"context"
	"encoding/json"
	"testing"
	"time"

	"hub.fastgit.org/golang/protobuf/ptypes"
	"hub.fastgit.org/stretchr/testify/require"

	"hub.fastgit.org/brocaar/chirpstack-api/go/v3/gw"
	"hub.fastgit.org/brocaar/chirpstack-application-server/internal/storage"
	"hub.fastgit.org/brocaar/chirpstack-application-server/internal/test"
	"hub.fastgit.org/brocaar/lorawan"
)

func TestGeolocBuffer(t *testing.T) {
	assert := require.New(t)

	conf := test.GetConfig()
	assert.NoError(storage.Setup(conf))

	now, _ := ptypes.TimestampProto(time.Now())
	tenMinAgo, _ := ptypes.TimestampProto(time.Now().Add(-10 * time.Minute))

	tests := []struct {
		Name          string
		DevEUI        lorawan.EUI64
		AddTTL        time.Duration
		GetTTL        time.Duration
		Items         [][]*gw.UplinkRXInfo
		ExpectedItems [][]*gw.UplinkRXInfo
	}{
		{
			Name: "add one item to queue - ttl 0",
			Items: [][]*gw.UplinkRXInfo{
				{
					{
						Time: now,
					},
				},
			},
		},
		{
			Name: "add one item to queue",
			Items: [][]*gw.UplinkRXInfo{
				{
					{
						Time: now,
					},
				},
			},
			ExpectedItems: [][]*gw.UplinkRXInfo{
				{
					{
						Time: now,
					},
				},
			},
			AddTTL: time.Minute,
			GetTTL: time.Minute,
		},
		{
			Name: "add three to queue, one expired",
			Items: [][]*gw.UplinkRXInfo{
				{
					{
						Time: now,
					},
				},
				{
					{
						Time: now,
					},
				},
				{
					{
						Time: tenMinAgo,
					},
				},
			},
			ExpectedItems: [][]*gw.UplinkRXInfo{
				{
					{
						Time: now,
					},
				},
				{
					{
						Time: now,
					},
				},
			},
			AddTTL: time.Minute,
			GetTTL: time.Minute,
		},
	}

	for _, tst := range tests {
		t.Run(tst.Name, func(t *testing.T) {
			storage.RedisClient().FlushAll(context.Background())
			assert := require.New(t)

			assert.NoError(SaveGeolocBuffer(context.Background(), tst.DevEUI, tst.Items, tst.AddTTL))

			resp, err := GetGeolocBuffer(context.Background(), tst.DevEUI, tst.GetTTL)
			assert.NoError(err)

			aa, _ := json.Marshal(tst.ExpectedItems)
			bb, _ := json.Marshal(resp)

			assert.Equal(string(aa), string(bb))
		})
	}
}
