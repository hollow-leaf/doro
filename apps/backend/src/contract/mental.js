var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, state, State, method, SmartContract, } from "o1js";
import { Cipher, ElGamalFF } from "o1js-elgamal";
export class Mental extends SmartContract {
    constructor() {
        super(...arguments);
        this.c1 = State();
        this.ans = State();
        this.pk = State();
        this.result = State();
    }
    setPubKey(pk) {
        this.pk.set(pk);
        this.c1.set(ElGamalFF.encrypt(Field(1), pk));
    }
    // calculate shuffle
    shuffleValue(randomValue) {
        const c1 = this.c1.get();
        this.c1.assertEquals(c1);
        const pk = this.pk.get();
        this.pk.assertEquals(pk);
        const product = c1.mul(ElGamalFF.encrypt(randomValue, pk));
        this.ans.set(product);
    }
    decrypt(secretKey) {
        const result = this.ans.get();
        this.ans.assertEquals(result);
        const plainText = ElGamalFF.decrypt(result, secretKey);
        this.result.set(plainText);
    }
    reset() {
        this.pk.set(Field(0));
        this.result.set(Field(0));
    }
}
__decorate([
    state(Cipher),
    __metadata("design:type", Object)
], Mental.prototype, "c1", void 0);
__decorate([
    state(Cipher),
    __metadata("design:type", Object)
], Mental.prototype, "ans", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Mental.prototype, "pk", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Mental.prototype, "result", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field]),
    __metadata("design:returntype", void 0)
], Mental.prototype, "setPubKey", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field]),
    __metadata("design:returntype", void 0)
], Mental.prototype, "shuffleValue", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field]),
    __metadata("design:returntype", void 0)
], Mental.prototype, "decrypt", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Mental.prototype, "reset", null);
//# sourceMappingURL=mental.js.map