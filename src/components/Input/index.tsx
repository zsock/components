import React from 'react';
import Checkbox from './components/Checkbox';
import Switch from './components/Switch';
import Radio from './components/Radio';
import RadioGroup from './components/RadioGroup';
import { Props } from './components/Checkbox/types';
import { InputComponent } from './types';


export const Input: InputComponent = React.forwardRef(({
    ...otherProps
}: Props, ref: React.Ref<any>): React.ReactElement => (
    <Checkbox ref={ref} {...otherProps} />
));


Input.Checkbox = Checkbox;
Input.Switch = Switch;
Input.Radio = Radio;
Input.RadioGroup = RadioGroup;


Input.displayName = 'Input';


export default Input;
