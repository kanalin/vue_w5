// 取得產品列表
// 按按鈕，顯示單一產品細節
// 加入購物車(可選擇數量)
// 購物車列表
// 調整數量
// 刪除品項

// 加入 VeeValidation 相關資源
const { Form, Field, ErrorMessage } = VeeValidate;
// 定義規則
VeeValidate.defineRule('required', VeeValidateRules['required']);
VeeValidate.defineRule('email', VeeValidateRules['email']);
VeeValidate.defineRule('min', VeeValidateRules['min']);
VeeValidate.defineRule('max', VeeValidateRules['max']);
// 加入多國語系
VeeValidateI18n.loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
});

const site = 'https://vue3-course-api.hexschool.io/v2/';
const apiPath = 'niniin';

const productModal = {
    props: ['addToCart'],
    data(){
        return{
            modal:{},
            tempProduct:{},
            qty: 1,
        }
    },
    template: '#userProductModal',
    methods:{
        hide(){
            this.modal.hide();
        },
        openModal(id){
            const url = `${site}api/${apiPath}/product/${id}`;
            axios.get(url)
                .then(res => {
                    this.tempProduct = res.data.product;
                    // console.log('單一產品', this.tempProduct);
                    this.modal.show();
                })
                .catch(err=>{
                    alert(err.data.message);
                    // console.log(err);
                })
        },
    },
    mounted(){
        this.modal = new bootstrap.Modal(this.$refs.modal);
    }
}

Vue.createApp({
    data(){
        return{
            products: [],
            productId: '',
            cart: {},
            loadingItem: '',
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            }
        }
    },
    components: {
        //區域註冊
        productModal,
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    methods:{
        getProducts(){
            const url = `${site}api/${apiPath}/products/all`;
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;
                    // console.log('產品列表', this.products);
                    // console.log(res.data);
                })
                .catch(err=>{
                    alert("(getProducts) "+err.data.message);
                    // console.log(err);
                })
        },
        addToCart(product_id, qty=1){
            const data = {
                product_id,
                qty,
            };
            this.loadingItem = product_id;
            const url = `${site}api/${apiPath}/cart`;
            axios.post(url, { data })
                .then(res => {
                    // console.log('加入購物車', res.data);
                    alert(res.data.data.product.title+" "+res.data.message);
                    this.$refs.productModal.hide();
                    this.getCart();
                    this.loadingItem = "";
                })
                .catch(err=>{
                    alert("(addToCart) "+err.data.message);
                    // console.log(err);
                })

        },
        getCart(){
            const url = `${site}api/${apiPath}/cart`;
            axios.get(url)
                .then(res => {
                    this.cart = res.data.data;
                    // console.log('購物車', this.cart);
                    // console.log(res.data);
                })
                .catch(err=>{
                    alert("(getProducts) "+err.data.message);
                    // console.log(err);
                })
        },
        updateCart(item, qty){
            const url = `${site}api/${apiPath}/cart/${item.id}`;
            const data = {
                product_id: item.product.id,
                qty,
            }
            this.loadingItem = item.id;
            axios.put(url, {data})
                .then(res => {
                    // alert(res.data.message);
                    // console.log('購物車更新', res.data);
                    this.getCart();
                    this.loadingItem = "";
                })
                .catch(err=>{
                    alert("(updateCart) "+err.data.message);
                    // console.log(err);
                })
        },
        deletCartItem(cartId){
            const url = `${site}api/${apiPath}/cart/${cartId}`;
            this.loadingItem = cartId;
            axios.delete(url)
                .then(res => {
                    alert(res.data.message);
                    // console.log('刪除購物車品項', res.data);
                    this.getCart();
                    this.loadingItem = "";
                })
                .catch(err=>{
                    alert("(deletCartItem) "+err.data.message);
                    // console.log(err);
                })
        },
        deletCartAll(){
            const url = `${site}api/${apiPath}/carts`;
            this.loadingItem = 'deleteCart';
            axios.delete(url)
                .then(res => {
                    alert(res.data.message);
                    // console.log('清空購物車', res.data);
                    this.getCart();
                    this.loadingItem = "";
                })
                .catch(err=>{
                    alert("(deletCartItem) "+err.data.message);
                    // console.log(err);
                })
        },
        openModal(id){
            this.productId = id;
            // console.log('外層帶入 productId:', id);
            this.$refs.productModal.openModal(id);
        },
        onSubmit(){
            // console.log(this.form);
            const url = `${site}api/${apiPath}/order`;
            const data = this.form;
            axios.post(url, {data})
                .then(res => {
                    alert(res.data.message);
                    // console.log('送出訂單', res.data);
                    this.$refs.form.resetForm();
                    this.form.message = "";
                    this.getCart();
                })
                .catch(err=>{
                    alert(err.data.message);
                    // console.log(err);
                })
        }
    },
    mounted(){
        this.getProducts();
        this.getCart();
    }
})
    .mount('#app');

