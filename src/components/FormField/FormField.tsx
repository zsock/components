import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { AnimatePresence, motion } from 'framer-motion';
import Checkbox from '../Checkbox';
import { get } from 'lodash';
import Radio from '../Radio';
import TextField from '../TextField';
import Switch from '../Switch';
import { FormFieldProps } from './FormField.types';


/* Map our input components for easier access */
const components: {
    [key: string]: React.ReactNode,
} = {
    checkbox: Checkbox,
    radio: Radio,
    switch: Switch,
};

/**
 * `FormField` is an abstraction of most inputs, additionally binding the rendered input to a `Form` so they can be
 * tracked and validated.
 * FormField preserves allmost all the logic that it inherits from its component types,
 * with handling of react-hook-form input registration, validation, and auto error binding
 *
 * > This component is not found in Material UI.
 */
export const FormField = React.forwardRef(({
    type = 'text',
    label,
    name,
    validation = {},
    helperText,
    ...otherProps
}: FormFieldProps, ref: React.Ref<any>): React.ReactElement => {


    const { unregister, register, formState: { errors } } = useFormContext();
    const Component: any = components[type] ?? TextField;
    const { ref: formInputRef, ...otherInputProps } = register(name, validation);

    /** Needed for new validation config to work when same input is used for multiple fields (w/ a dropdown) */
    React.useEffect(() => unregister(name), []);


    /**
     * configure our Framer animation
     */
    const fadeAnim = {
        // eslint-disable-next-line id-length
        initial: { opacity: 0, y: -5 },
        // eslint-disable-next-line id-length
        animate: { opacity: 1, y: -0 },
        exit: { opacity: 0 },
    };


    /**
     * determine what to render in the helper text. Keys have to be changed based on content ot ensure the component
     * updates correctly.
     */

    function getHelperText(): React.ReactNode {

        let content: React.ReactNode = ' ';
        let key = 1;

        /** else, return helperText if provided */
        if (helperText) {
            content = helperText;
            key = 3;
        }

        const errorMessage = get(errors, `${name}.message`);

        /** if there is an error, return that */
        if (errorMessage) {
            content = errorMessage;
            key = 2;
        }

        if (key === 1) return <AnimatePresence />;

        return (
            <AnimatePresence>
                <motion.span
                    key={key}
                    layout="position"
                    role="alert"
                    style={{
                        display: 'inline-block',
                        position: 'absolute',
                    }}
                    {...fadeAnim}>
                    {content}
                </motion.span>
            </AnimatePresence>
        );

    }


    /**
     * if the component is a TextField, we just use that.
     */
    if (Component === TextField) return (
        <Component
            error={Boolean(get(errors, name))}
            helperText={getHelperText()}
            inputRef={formInputRef}
            label={label}
            ref={ref}
            type={type}
            {...otherInputProps}
            {...otherProps}
        />
    );


    /**
     * if there is no label and not a TextField, we just use the component
     */
    if (!label) return (
        <Component
            inputRef={formInputRef}
            ref={ref}
            {...otherInputProps}
            {...otherProps}
        />
    );


    /**
     * otherwise, we wrap it in a FormControlLabel
     */
    return (
        <FormControlLabel
            control={<Component ref={ref} {...otherInputProps} {...otherProps} />}
            inputRef={formInputRef}
            label={label}
        />
    );


});


FormField.displayName = 'FormField';


export default FormField;
