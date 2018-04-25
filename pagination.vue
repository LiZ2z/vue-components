Vue.component("pages",{
    template:"#pages",
    data:function () {
        return {
            active:1,
            list:0,
            __pages:[]
        }
    },
    props:['pages'],
    mounted:function () {
        var arr =[],
            i,len;
        for(i=0,len=this.pages;i<len;i++){
            arr[i]=i+1;
        }
        this.__pages=arr;
        this.list =arr.length>9? arr.slice(0,9):arr;
    },
    methods:{
        choosePage:function (a) {
            this.$emit("switch-page",a);
            this.active=a;
            var pages=this.__pages,
                pagesLen = pages.length;
            if(pagesLen>9){
                /*
                * a为页码
                * 最多显示九个页码, 要将点击的这个放到中间,
                * 判断    其前方第4个页码是否大于等与0
                * 且      其后方第4个页码是否小于等与 最大页码数
                * 若正确, 则截取 页码数组中 此页码前四位至后四位,共9位,
                * 否则 ....
                *
                * 注意 页码-数组的索引=1
                * */
                this.list = a-5>=0&&a+4<=pagesLen ?
                            pages.slice(a-5,a+4) :
                            a-5<0 ? pages.slice(0,9): pages.slice(pagesLen-9,pagesLen);
            }
        }
    }
});
