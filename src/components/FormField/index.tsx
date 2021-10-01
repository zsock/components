import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { AnimatePresence, motion } from 'framer-motion';
import Checkbox from '@components/Checkbox';
import Radio from '@components/Radio';
import TextField from '@components/TextField';
import Switch from '@components/Switch';
import useStyles from './styles';
import { Props } from './types';


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
 *
 * > This component is not found in Material UI.
 */
export const FormField = React.forwardRef(({
    helperText,
    label,
    name,
    onChange,
    type = 'text',
    validation = {},
    ...otherProps
}: Props, ref: React.Ref<any>): React.ReactElement => {


    const classes = useStyles();
    const { formState: { errors }, trigger, register, unregister } = useFormContext();
    const Component: any = components[type] ?? TextField;
    const { ref: formInputRef, ...otherInputProps } = register(name, validation);

    const [showHelperText, setShowHelperText] = React.useState(false);


    /** Needed for new validation config to work when same input is used for multiple fields (w/ a dropdown) */
    React.useEffect(() => unregister(name), []);


    React.useEffect(() => {
        setShowHelperText(Boolean(errors[name]) || Boolean(helperText));
    }, [errors, helperText]);

    const handleChange = async(evt: React.ChangeEvent<HTMLInputElement>): Promise<void> => {

        if (onChange) onChange(evt);
        await trigger([name]);
    };


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

        /** if there is an error, return that */
        if (errors[name]?.message) {
            content = errors[name]?.message;
            key = 2;
        }

        if (key === 1) return <AnimatePresence />;

        return (
            <AnimatePresence>
                <motion.span
                    key={key}
                    layout
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
            FormHelperTextProps={{
                classes: {
                    contained: showHelperText ? null : classes.noMarginTop,
                },
            }}
            error={Boolean(errors[name])}
            helperText={getHelperText()}
            inputRef={formInputRef}
            label={label}
            ref={ref}
            type={type}
            {...otherInputProps}
            {...otherProps}
            onChange={handleChange}
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
            onChange={handleChange}
        />
    );


    /**
     * otherwise, we wrap it in a FormControlLabel
     */
    return (
        <FormControlLabel
            control={<Component ref={ref} {...otherInputProps} {...otherProps} onChange={handleChange} />}
            inputRef={formInputRef}
            label={label}
        />
    );


});


FormField.displayName = 'FormField';


export default FormField;
