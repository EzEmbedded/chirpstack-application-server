package external

import (
	"hub.fastgit.org/brocaar/chirpstack-application-server/internal/api/external/auth"
	"hub.fastgit.org/brocaar/chirpstack-application-server/internal/storage"
	"hub.fastgit.org/gofrs/uuid"
	"golang.org/x/net/context"
)

type TestValidator struct {
	ctx            context.Context
	validatorFuncs []auth.ValidatorFunc
	returnError    error
	returnSubject  string
	returnAPIKeyID uuid.UUID
	returnUser     storage.User
}

func (v *TestValidator) Validate(ctx context.Context, funcs ...auth.ValidatorFunc) error {
	v.ctx = ctx
	v.validatorFuncs = funcs
	return v.returnError
}

func (v *TestValidator) GetSubject(ctx context.Context) (string, error) {
	return v.returnSubject, v.returnError
}

func (v *TestValidator) GetAPIKeyID(ctx context.Context) (uuid.UUID, error) {
	return v.returnAPIKeyID, v.returnError
}

func (v *TestValidator) GetUser(ctx context.Context) (storage.User, error) {
	return v.returnUser, v.returnError
}
