import React, { createContext, useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { Logger } from '../../shared/helpers/class-logger.helper';
import { Data } from '../modules/data';
import { DataState } from '../modules/data.state';

interface DataCtx extends Pick<Data,
  | 'state$'
> {
  state: DataState;
}

export const DataContext = createContext<DataCtx>(null!);


const _log = new Logger('DataStateCtx');


/**
 * @description
 * provides server state to the application
 *
 * @param props
 */
export const DataProvider: React.FC<{ data: Data }> = function DataProvider(props) {
  const [dataCtx, setDataCtx] = useState<DataCtx>(() => {
    const ctx: DataCtx = {
      state: props.data.state$.getValue(),
      state$: props.data.state$,
    }
    return ctx;
  });

  useEffect(() => {
    const subs: Subscription[] = [];
    subs.push(dataCtx.state$.subscribe((state) => setDataCtx((prev): DataCtx => ({ ...prev, state }))))
    return () => subs.forEach(sub => sub.unsubscribe());
  }, [])

  return (
    <DataContext.Provider value={dataCtx}>
      {props.children}
    </DataContext.Provider>
  );
}