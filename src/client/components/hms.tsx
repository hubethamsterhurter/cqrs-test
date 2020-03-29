import './hms.css';
import React from 'react';
import classnames from 'classnames';
import { hms } from '../../shared/helpers/hms.helper';

export const HMS: React.FC<{ date: Date, className?: string }> = function HMS(props) {
  return (
    <span className={classnames('hms', props.className)}>{hms(props.date)}</span>
  )
}