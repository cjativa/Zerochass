import { AuthenticationService } from '../../../server/api/services/authenticationService';

export default async (request, response) => {
    response = AuthenticationService.logOut(request, response);
    response.json(true);
};