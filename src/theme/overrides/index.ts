import merge from 'lodash/merge';
import { Components, Theme } from '@mui/material/styles';
import { button } from './components/button';
import { defaultProps } from './default-props';

export function componentsOverrides(theme: Theme) {
  const components = merge(
    defaultProps(theme),
    button(theme),
  );

  return components;
}
