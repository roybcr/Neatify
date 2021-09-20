import { Subject } from "rxjs";

const skeletonSubject = new Subject();

export const delayService = {
  renderSkeleton: (val: boolean) => skeletonSubject.next(val),
  removeSkeleton: () => skeletonSubject.next(undefined),
  listen: () => skeletonSubject.asObservable(),
};
