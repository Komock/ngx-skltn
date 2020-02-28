import { BehaviorSubject } from 'rxjs';
import { generateId } from '../helpers';
import { SkltnBoneDirective } from '../directives/skltn-bone.directive';

export class BonesList {

  changes = new BehaviorSubject<SkltnBoneDirective[]>([]);

  private map = new Map();

  constructor() {}

  add(elRef: SkltnBoneDirective): string {
    const id = generateId();
    this.map.set(id, elRef);
    this.emit();
    return id;
  }

  remove(id: string) {
    this.map.delete(id);
    this.emit();
  }

  private emit() {
    const elementList = this.getElementList();
    this.changes.next(elementList);
  }

  private getElementList(): SkltnBoneDirective[] {
    const values = this.map.values();
    return Array.from(values);
  }
}
