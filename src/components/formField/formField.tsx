import React, { ReactNode } from 'react';

interface IFormFieldProps {
    labelText: string,
    children: ReactNode,

    helperText?: string,
    className?: string,
};

export const FormField = ({ className, labelText, children, helperText }: IFormFieldProps) => {

    let classString = 'form-field';

    if (className) {
        classString += ` ${className}`;
    }

    return (
        <div className={classString}>
            <label className="form-field__label">
                {labelText}
            </label>

            {helperText &&
                <span className="form-field__hint">
                    {helperText}
                </span>
            }

            <div className="form-field__input">
                {children}
            </div>
        </div>
    );
}