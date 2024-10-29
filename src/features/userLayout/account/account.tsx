import { fetcher } from '../../../../server/api/constants/fetcher';

export const Account = () => {
    return (
            <div className="account">

                {/** Heading section */}
                <div className="account__heading">
                    <div className="form-field">
                        <label className="form-field__label">Email Address</label>
                        <input className="form-field__input" type="text" />
                    </div>
                </div>

                {/** Divider */}
                <hr className="divider" />

                {/** Rest of account information */}
                <div className="account__body">

                    {/** Password field */}
                    <div className="form-field">
                        <label className="form-field__label">Password</label>
                        <input className="form-field__input" type="password" />
                    </div>

                    {/** Confirm password field */}
                    <div className="form-field">
                        <label className="form-field__label">Confirm Password</label>
                        <input className="form-field__input" type="password" />
                    </div>

                    {/** Save */}
                    <div className="form-field">
                        <button className="form-field__button save">Save</button>
                    </div>
                </div>
            </div>
    );
};