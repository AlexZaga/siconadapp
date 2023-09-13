class Storage {
    constructor() {
        this.data = new Map();
    }
    key(n) {
        return [...this.data.keys()][n];
    }
    getBackgroundImage() {
        return "https://res.cloudinary.com/interprocsysmex/image/upload/v1673644266/ahjende/ofertaeducativa/ofedu-img8_dqbsre.jpg"
    }
    getImageENDE() {
        return "https://res.cloudinary.com/interprocsysmex/image/upload/v1674512758/ahjende/landpage/Logo_Sin_Texto_sdcvcf.png"
    }
    getAvatarMale() {
        return "https://res.cloudinary.com/interprocsysmex/image/upload/v1693835210/ahjende/siconad/avatares/male-avatar_vecnhd.png"
    }
    getAvatarFemale() {
        return "https://res.cloudinary.com/interprocsysmex/image/upload/v1693835211/ahjende/siconad/avatares/female-avatar_c5bgmw.png"
    }
    getItem(key) {
        return this.data.get(key);
    }
    getLength() {
        return this.data.size;
    }
    setItem(key, value) {
        this.data.set(key, value);
    }
    removeItem(key) {
        this.data.delete(key);
    }
    clear() {
        this.data = new Map();
    }
}

let sessionStorage = globalThis.sessionStorage = globalThis.sessionStorage ?? new Storage();

export { Storage, sessionStorage };
