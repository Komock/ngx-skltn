import { BehaviorSubject } from 'rxjs';
import { generateId } from '../helpers';
import { SkltnBoneDirective } from '../directives/skltn-bone.directive';
import { Injectable } from "@angular/core";

@Injectable()
export class BonesList {

  changes = new BehaviorSubject<SkltnBoneDirective[]>([]);

  private map = new Map<string, SkltnBoneDirective>();

  constructor() {}

  add(bone: SkltnBoneDirective): string {
    const id = generateId();
    this.map.set(id, bone);
    this.emit();
    return id;
  }

  remove(id: string) {
    this.map.delete(id);
    this.emit();
  }

  private emit() {
    const list = this.getList();
    this.changes.next(list);
  }

  private getList(): SkltnBoneDirective[] {
    const values = this.map.values();
    return Array.from(values);
  }
}
