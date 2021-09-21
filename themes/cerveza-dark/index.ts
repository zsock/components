import { createTheme } from '@material-ui/core/styles';
import { merge as _merge } from 'lodash';
import Cerveza from '../cerveza';

import InputLabel from './components/InputLabel';
import OutlinedInput from './components/OutlinedInput';

const CervezaDark = createTheme(_merge(
    {},
    Cerveza,
    InputLabel,
    OutlinedInput,
));


export default CervezaDark;
