import './alert-container.css';
import { toast } from 'react-toastify';
import React, { useContext, useEffect } from 'react';
import { WsContext } from '../providers/ws.provider';
import { Subscription } from 'rxjs';
import { ValidationError } from 'class-validator';
import { filter } from 'rxjs/operators';
import { ErrorSmo } from '../../shared/broadcasts/broadcast.error';
import { CmInvalidSmo } from '../../shared/broadcasts/broadcast.command-invalid';
import { CMMalformedSmo } from '../../shared/broadcasts/broadcast.command-malformed';

// https://stackoverflow.com/questions/37909134/nbsp-jsx-not-working
// function rws(str: string) { return str.replace(/ /g, '&nbsp;'); }
function rws(str: string) { return str.replace(/ /g, '\u00A0'); }

function flattenValidationErrors(error: ValidationError, currentIndentation: string, tab: string, depth: number): [string, string][] {
  const ownLines: [string, string][] = error.constraints
    ? Object.entries(error.constraints).map(([name, message]) => [`${depth}${error.property}${name}`, `${rws(currentIndentation)} ${message}`])
    : [];

  const childLines = error.children.flatMap((error) => flattenValidationErrors(error, `${currentIndentation}${tab}`, tab, depth + 1));
  const result: [string, string][] = [
    ...ownLines,
    ...(childLines.length ? [[`d${depth}`, `${currentIndentation}${error.property}:`]] : []) as [string, string][],
    ...childLines,
  ];
  return result;
}

function jsxValidationErrors(errors: ValidationError[], indentation: string, tab: string): JSX.Element {
  const rendered = 
    <div>
      {errors
        .flatMap(error => flattenValidationErrors(error, indentation, tab, 1))
        .map(([k, v], i) => <div key={k}>{v}</div>)
      }
    </div>
  return rendered;
}

export const AlertContainer: React.FC = function AlertContainer(props) {
  const wsCtx = useContext(WsContext);

  useEffect(() => {
    const subs: Subscription[] = []

    // errors (like http errors)
    subs.push(
      wsCtx
        .messageOf$(ErrorSmo)
        .subscribe(evt => {
          console.warn('Received error from server', evt);
          const msg = (
            <div>
              <h3 className='alert-header'>{`Error`}</h3>
              <div>{`Code: ${evt.dto.code}`}</div>
              <div>{`Message: ${evt.dto.message}`}</div>
            </div>
          );
          toast.error(msg);
        })
    );

    // echo invalid client messages
    subs.push(
      wsCtx
        .messageOf$(CmInvalidSmo)
        .subscribe(evt => {
          console.warn('Message invalidated by server', evt);
          const msg = (
            <div>
              <h3 className='alert-header'>{`Invalid`}</h3>
              {jsxValidationErrors(evt.dto.errors, '- ', '  ')}
            </div>
          );
          toast.error(msg);
        })
    );

    // echo malformed client messagess
    subs.push(
      wsCtx
        .messageOf$(CMMalformedSmo)
        .subscribe(evt => {
          console.warn('Message invalidated by server', evt);
          const msg = (
            <div>
              <h3 className='alert-header'>{`Malformed Client Message`}</h3>
              <div>{`- name: ${evt.dto.error.name}`}</div>
              <div>{`- message: ${evt.dto.error.message}`}</div>
            </div>
          );
          toast.error(msg);
        })
    );

    // malformed server messages
    subs.push(
      wsCtx
        .messageMalformed$
        .subscribe(evt => {
          console.warn('received malformed server message', evt.err);
          const msg = (
            <div>
              <h3 className='alert-header'>{`Malformed Server Message`}</h3>
              <div>{`- name: ${evt.err.name}`}</div>
              <div>{`- message: ${evt.err.message}`}</div>
            </div>
          );
          toast.error(msg);
        })
    );

    // invalid server messages
    subs.push(
      wsCtx
        .messageInvalid$
        .subscribe(evt => {
          console.warn('received invalid server message', evt);
          const msg = (
            <div>
              <h3 className='alert-header'>{rws(`Invalid Server Message`)}</h3>
              <div><strong>{`Details:`}</strong></div>
              <div><strong>{`- trace:`}</strong></div>
              <div>{`${rws('-   ')}trace_id: ${evt.trace?.id}`}</div>
              <div>{`${rws('-   ')}prev_trace_id: ${evt.trace?.prev_id}`}</div>
              <div>{`${rws('-   ')}origin_trace_id: ${evt.trace?.origin_id}`}</div>
              <div><strong>{`${rws('- ')}constructor:`}</strong></div>
              <div>{`${rws('-   ')}name: ${evt.Ctor.name}`}</div>
              <div><strong>{`${rws('- ')}errors:`}</strong></div>
              {jsxValidationErrors(evt.errs, '-   ', ' ')}
            </div>
          );
          toast.error(msg);
        })
    );

    return () => subs.forEach(sub => sub.unsubscribe());
  }, []);

  return (
    <>
    </>
  );
}