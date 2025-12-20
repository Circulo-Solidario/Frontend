import{a as ve}from"./chunk-7NKSXQ2E.js";import{a as ye}from"./chunk-QD7ZASQF.js";import{a as Ce}from"./chunk-FKOEVO4B.js";import{C as xe,D as we,a as ce,t as be}from"./chunk-CQCVERZP.js";import{$ as ge,b as G,d as U,ga as me,h as ue,ha as fe,i as pe,ia as T,j as he,la as q,na as _e}from"./chunk-4G3JCKZK.js";import{c as Ve,d as $,f as X,g as K,h as Y}from"./chunk-4O3FVBGX.js";import{e as W,f as le,g as se,l as N,n as de}from"./chunk-QOJUQ6XD.js";import{$ as M,$b as D,Ab as g,Ec as oe,Hb as o,Ib as _,Jb as b,Kb as x,Ob as A,Pb as O,Qb as Q,Rb as w,Sb as ne,Wb as v,Xb as r,Xc as C,Yb as ie,Yc as H,Za as d,Zb as R,_ as ee,_b as V,aa as F,ac as m,bc as f,ea as I,fc as j,ic as p,ja as c,jb as P,jc as ae,ka as u,kb as B,kc as re,la as Z,nb as L,pb as h,qc as z,rb as S,sb as te,sc as y,tc as E,za as k}from"./chunk-A4JG42N6.js";var Te=`
    .p-panel {
        display: block;
        border: 1px solid dt('panel.border.color');
        border-radius: dt('panel.border.radius');
        background: dt('panel.background');
        color: dt('panel.color');
    }

    .p-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: dt('panel.header.padding');
        background: dt('panel.header.background');
        color: dt('panel.header.color');
        border-style: solid;
        border-width: dt('panel.header.border.width');
        border-color: dt('panel.header.border.color');
        border-radius: dt('panel.header.border.radius');
    }

    .p-panel-toggleable .p-panel-header {
        padding: dt('panel.toggleable.header.padding');
    }

    .p-panel-title {
        line-height: 1;
        font-weight: dt('panel.title.font.weight');
    }

    .p-panel-content {
        padding: dt('panel.content.padding');
    }

    .p-panel-footer {
        padding: dt('panel.footer.padding');
    }
`;var Fe=["header"],Pe=["icons"],Be=["content"],Le=["footer"],Ae=["headericons"],Oe=["contentWrapper"],Qe=["*",[["p-header"]],[["p-footer"]]],Re=["*","p-header","p-footer"],je=n=>({transitionParams:n,height:"0",opacity:"0"}),ze=n=>({value:"hidden",params:n}),We=n=>({transitionParams:n,height:"*",opacity:"1"}),Ne=n=>({value:"visible",params:n}),qe=n=>({$implicit:n});function $e(n,l){if(n&1&&(_(0,"span"),ae(1),b()),n&2){let e=r(2);p(e.cx("title")),g("id",e.id+"_header"),d(),re(e._header)}}function Xe(n,l){n&1&&Q(0)}function Ke(n,l){}function Ye(n,l){n&1&&h(0,Ke,0,0,"ng-template")}function Ze(n,l){n&1&&(A(0),Z(),x(1,"svg",11),O())}function Ge(n,l){n&1&&(A(0),Z(),x(1,"svg",12),O())}function Ue(n,l){if(n&1&&(A(0),h(1,Ze,2,0,"ng-container",9)(2,Ge,2,0,"ng-container",9),O()),n&2){let e=r(4);d(),o("ngIf",!e.collapsed),d(),o("ngIf",e.collapsed)}}function Je(n,l){}function et(n,l){n&1&&h(0,Je,0,0,"ng-template")}function tt(n,l){if(n&1&&h(0,Ue,3,2,"ng-container",9)(1,et,1,0,null,10),n&2){let e=r(3);o("ngIf",!e.headerIconsTemplate&&!e._headerIconsTemplate&&!(e.toggleButtonProps!=null&&e.toggleButtonProps.icon)),d(),o("ngTemplateOutlet",e.headerIconsTemplate||e._headerIconsTemplate)("ngTemplateOutletContext",y(3,qe,e.collapsed))}}function nt(n,l){if(n&1){let e=w();_(0,"p-button",8),v("click",function(t){c(e);let a=r(2);return u(a.onIconClick(t))})("keydown",function(t){c(e);let a=r(2);return u(a.onKeyDown(t))}),h(1,tt,2,5,"ng-template",null,1,oe),b()}if(n&2){let e=r(2);o("text",!0)("rounded",!0)("styleClass",e.cx("pcToggleButton"))("buttonProps",e.toggleButtonProps),g("id",e.id+"_header")("aria-label",e.buttonAriaLabel)("aria-controls",e.id+"_content")("aria-expanded",!e.collapsed)}}function it(n,l){if(n&1){let e=w();_(0,"div",6),v("click",function(t){c(e);let a=r();return u(a.onHeaderClick(t))}),h(1,$e,2,4,"span",5),R(2,1),h(3,Xe,1,0,"ng-container",4),_(4,"div"),h(5,Ye,1,0,null,4)(6,nt,3,8,"p-button",7),b()()}if(n&2){let e=r();p(e.cx("header")),g("id",e.id+"-titlebar"),d(),o("ngIf",e._header),d(2),o("ngTemplateOutlet",e.headerTemplate||e._headerTemplate),d(),p(e.cx("icons")),d(),o("ngTemplateOutlet",e.iconTemplate||e._iconTemplate),d(),o("ngIf",e.toggleable)}}function at(n,l){n&1&&Q(0)}function rt(n,l){n&1&&Q(0)}function ot(n,l){if(n&1&&(_(0,"div"),R(1,2),h(2,rt,1,0,"ng-container",4),b()),n&2){let e=r();p(e.cx("footer")),d(2),o("ngTemplateOutlet",e.footerTemplate||e._footerTemplate)}}var lt=`
    ${Te}

    /* For PrimeNG */
    .p-panel-collapsed > .p-panel-content-container,
    .p-panel-content-container.ng-animating {
        overflow: hidden;
    }
`,st={root:({instance:n})=>["p-panel p-component",{"p-panel-toggleable":n.toggleable,"p-panel-expanded":!n.collapsed&&n.toggleable,"p-panel-collapsed":n.collapsed&&n.toggleable}],icons:({instance:n})=>["p-panel-icons",{"p-panel-icons-start":n.iconPos==="start","p-panel-icons-end":n.iconPos==="end","p-panel-icons-center":n.iconPos==="center"}],header:"p-panel-header",title:"p-panel-title",headerActions:"p-panel-header-actions",pcToggleButton:"p-panel-toggle-button",contentContainer:"p-panel-content-container",content:"p-panel-content",footer:"p-panel-footer"},Se=(()=>{class n extends q{name="panel";theme=lt;classes=st;static \u0275fac=(()=>{let e;return function(t){return(e||(e=k(n)))(t||n)}})();static \u0275prov=M({token:n,factory:n.\u0275fac})}return n})();var dt=(()=>{class n extends _e{toggleable;_header;collapsed;id=ge("pn_id_");styleClass;iconPos="end";showHeader=!0;toggler="icon";transitionOptions="400ms cubic-bezier(0.86, 0, 0.07, 1)";toggleButtonProps;collapsedChange=new S;onBeforeToggle=new S;onAfterToggle=new S;footerFacet;animating;headerTemplate;iconTemplate;contentTemplate;footerTemplate;headerIconsTemplate;_headerTemplate;_iconTemplate;_contentTemplate;_footerTemplate;_headerIconsTemplate;contentWrapperViewChild;get buttonAriaLabel(){return this._header}_componentStyle=I(Se);onHeaderClick(e){this.toggler==="header"&&this.toggle(e)}onIconClick(e){this.toggler==="icon"&&this.toggle(e)}toggle(e){if(this.animating)return!1;this.animating=!0,this.onBeforeToggle.emit({originalEvent:e,collapsed:this.collapsed}),this.toggleable&&(this.collapsed?this.expand():this.collapse()),this.cd.markForCheck(),e.preventDefault()}expand(){this.collapsed=!1,this.collapsedChange.emit(this.collapsed),this.updateTabIndex()}collapse(){this.collapsed=!0,this.collapsedChange.emit(this.collapsed),this.updateTabIndex()}getBlockableElement(){return this.el.nativeElement}updateTabIndex(){this.contentWrapperViewChild&&this.contentWrapperViewChild.nativeElement.querySelectorAll("input, button, select, a, textarea, [tabindex]").forEach(i=>{this.collapsed?i.setAttribute("tabindex","-1"):i.removeAttribute("tabindex")})}onKeyDown(e){(e.code==="Enter"||e.code==="Space")&&(this.toggle(e),e.preventDefault())}onToggleDone(e){this.animating=!1,this.onAfterToggle.emit({originalEvent:e,collapsed:this.collapsed})}templates;ngAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"header":this._headerTemplate=e.template;break;case"content":this._contentTemplate=e.template;break;case"footer":this._footerTemplate=e.template;break;case"icons":this._iconTemplate=e.template;break;case"headericons":this._headerIconsTemplate=e.template;break;default:this._contentTemplate=e.template;break}})}static \u0275fac=(()=>{let e;return function(t){return(e||(e=k(n)))(t||n)}})();static \u0275cmp=P({type:n,selectors:[["p-panel"]],contentQueries:function(i,t,a){if(i&1&&(V(a,me,5),V(a,Fe,4),V(a,Pe,4),V(a,Be,4),V(a,Le,4),V(a,Ae,4),V(a,fe,4)),i&2){let s;m(s=f())&&(t.footerFacet=s.first),m(s=f())&&(t.headerTemplate=s.first),m(s=f())&&(t.iconTemplate=s.first),m(s=f())&&(t.contentTemplate=s.first),m(s=f())&&(t.footerTemplate=s.first),m(s=f())&&(t.headerIconsTemplate=s.first),m(s=f())&&(t.templates=s)}},viewQuery:function(i,t){if(i&1&&D(Oe,5),i&2){let a;m(a=f())&&(t.contentWrapperViewChild=a.first)}},hostAttrs:["data-pc-name","panel"],hostVars:3,hostBindings:function(i,t){i&2&&(ne("id",t.id),p(t.cn(t.cx("root"),t.styleClass)))},inputs:{toggleable:[2,"toggleable","toggleable",C],_header:[0,"header","_header"],collapsed:[2,"collapsed","collapsed",C],id:"id",styleClass:"styleClass",iconPos:"iconPos",showHeader:[2,"showHeader","showHeader",C],toggler:"toggler",transitionOptions:"transitionOptions",toggleButtonProps:"toggleButtonProps"},outputs:{collapsedChange:"collapsedChange",onBeforeToggle:"onBeforeToggle",onAfterToggle:"onAfterToggle"},features:[z([Se]),L],ngContentSelectors:Re,decls:7,vars:20,consts:[["contentWrapper",""],["icon",""],[3,"class","click",4,"ngIf"],["role","region",3,"id"],[4,"ngTemplateOutlet"],[3,"class",4,"ngIf"],[3,"click"],["severity","secondary","type","button","role","button",3,"text","rounded","styleClass","buttonProps","click","keydown",4,"ngIf"],["severity","secondary","type","button","role","button",3,"click","keydown","text","rounded","styleClass","buttonProps"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","minus"],["data-p-icon","plus"]],template:function(i,t){if(i&1){let a=w();ie(Qe),h(0,it,7,9,"div",2),_(1,"div",3),v("@panelContent.done",function(Ie){return c(a),u(t.onToggleDone(Ie))}),_(2,"div",null,0),R(4),h(5,at,1,0,"ng-container",4),b(),h(6,ot,3,3,"div",5),b()}i&2&&(o("ngIf",t.showHeader),d(),p(t.cx("contentContainer")),o("id",t.id+"_content")("@panelContent",t.collapsed?y(14,ze,y(12,je,t.animating?t.transitionOptions:"0ms")):y(18,Ne,y(16,We,t.animating?t.transitionOptions:"0ms"))),g("aria-labelledby",t.id+"_header")("aria-hidden",t.collapsed)("tabindex",t.collapsed?"-1":void 0),d(),p(t.cx("content")),d(3),o("ngTemplateOutlet",t.contentTemplate||t._contentTemplate),d(),o("ngIf",t.footerFacet||t.footerTemplate||t._footerTemplate))},dependencies:[N,W,se,ye,ve,we,xe,T],encapsulation:2,data:{animation:[Ve("panelContent",[K("hidden",X({height:"0"})),K("void",X({height:"{{height}}"}),{params:{height:"0"}}),K("visible",X({height:"*"})),Y("visible <=> hidden",[$("{{transitionParams}}")]),Y("void => hidden",$("{{transitionParams}}")),Y("void => visible",$("{{transitionParams}}"))])]},changeDetection:0})}return n})(),Yt=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275mod=B({type:n});static \u0275inj=F({imports:[dt,T,T]})}return n})();var ke=`
    .p-slider {
        display: block;
        position: relative;
        background: dt('slider.track.background');
        border-radius: dt('slider.track.border.radius');
    }

    .p-slider-handle {
        cursor: grab;
        touch-action: none;
        user-select: none;
        display: flex;
        justify-content: center;
        align-items: center;
        height: dt('slider.handle.height');
        width: dt('slider.handle.width');
        background: dt('slider.handle.background');
        border-radius: dt('slider.handle.border.radius');
        transition:
            background dt('slider.transition.duration'),
            color dt('slider.transition.duration'),
            border-color dt('slider.transition.duration'),
            box-shadow dt('slider.transition.duration'),
            outline-color dt('slider.transition.duration');
        outline-color: transparent;
    }

    .p-slider-handle::before {
        content: '';
        width: dt('slider.handle.content.width');
        height: dt('slider.handle.content.height');
        display: block;
        background: dt('slider.handle.content.background');
        border-radius: dt('slider.handle.content.border.radius');
        box-shadow: dt('slider.handle.content.shadow');
        transition: background dt('slider.transition.duration');
    }

    .p-slider:not(.p-disabled) .p-slider-handle:hover {
        background: dt('slider.handle.hover.background');
    }

    .p-slider:not(.p-disabled) .p-slider-handle:hover::before {
        background: dt('slider.handle.content.hover.background');
    }

    .p-slider-handle:focus-visible {
        box-shadow: dt('slider.handle.focus.ring.shadow');
        outline: dt('slider.handle.focus.ring.width') dt('slider.handle.focus.ring.style') dt('slider.handle.focus.ring.color');
        outline-offset: dt('slider.handle.focus.ring.offset');
    }

    .p-slider-range {
        display: block;
        background: dt('slider.range.background');
        border-radius: dt('slider.track.border.radius');
    }

    .p-slider.p-slider-horizontal {
        height: dt('slider.track.size');
    }

    .p-slider-horizontal .p-slider-range {
        inset-block-start: 0;
        inset-inline-start: 0;
        height: 100%;
    }

    .p-slider-horizontal .p-slider-handle {
        inset-block-start: 50%;
        margin-block-start: calc(-1 * calc(dt('slider.handle.height') / 2));
        margin-inline-start: calc(-1 * calc(dt('slider.handle.width') / 2));
    }

    .p-slider-vertical {
        min-height: 100px;
        width: dt('slider.track.size');
    }

    .p-slider-vertical .p-slider-handle {
        inset-inline-start: 50%;
        margin-inline-start: calc(-1 * calc(dt('slider.handle.width') / 2));
        margin-block-end: calc(-1 * calc(dt('slider.handle.height') / 2));
    }

    .p-slider-vertical .p-slider-range {
        inset-block-end: 0;
        inset-inline-start: 0;
        width: 100%;
    }
`;var ct=["sliderHandle"],ut=["sliderHandleStart"],pt=["sliderHandleEnd"],ht=(n,l)=>({position:"absolute","inset-inline-start":n,width:l}),gt=(n,l)=>({position:"absolute",bottom:n,height:l}),mt=n=>({position:"absolute",height:n}),ft=n=>({position:"absolute",width:n}),J=(n,l)=>({position:"absolute","inset-inline-start":n,bottom:l});function _t(n,l){if(n&1&&x(0,"span",7),n&2){let e=r();p(e.cx("range")),o("ngStyle",E(4,ht,e.offset!==null&&e.offset!==void 0?e.offset+"%":e.handleValues[0]+"%",e.diff?e.diff+"%":e.handleValues[1]-e.handleValues[0]+"%")),g("data-pc-section","range")}}function bt(n,l){if(n&1&&x(0,"span",7),n&2){let e=r();p(e.cx("range")),o("ngStyle",E(4,gt,e.offset!==null&&e.offset!==void 0?e.offset+"%":e.handleValues[0]+"%",e.diff?e.diff+"%":e.handleValues[1]-e.handleValues[0]+"%")),g("data-pc-section","range")}}function vt(n,l){if(n&1&&x(0,"span",7),n&2){let e=r();p(e.cx("range")),o("ngStyle",y(4,mt,e.handleValue+"%")),g("data-pc-section","range")}}function yt(n,l){if(n&1&&x(0,"span",7),n&2){let e=r();p(e.cx("range")),o("ngStyle",y(4,ft,e.handleValue+"%")),g("data-pc-section","range")}}function xt(n,l){if(n&1){let e=w();_(0,"span",8,0),v("touchstart",function(t){c(e);let a=r();return u(a.onDragStart(t))})("touchmove",function(t){c(e);let a=r();return u(a.onDrag(t))})("touchend",function(t){c(e);let a=r();return u(a.onDragEnd(t))})("mousedown",function(t){c(e);let a=r();return u(a.onMouseDown(t))})("keydown",function(t){c(e);let a=r();return u(a.onKeyDown(t))}),b()}if(n&2){let e=r();p(e.cx("handle")),j("transition",e.dragging?"none":null),o("ngStyle",E(14,J,e.orientation=="horizontal"?e.handleValue+"%":null,e.orientation=="vertical"?e.handleValue+"%":null))("pAutoFocus",e.autofocus),g("tabindex",e.$disabled()?null:e.tabindex)("aria-valuemin",e.min)("aria-valuenow",e.value)("aria-valuemax",e.max)("aria-labelledby",e.ariaLabelledBy)("aria-label",e.ariaLabel)("aria-orientation",e.orientation)("data-pc-section","handle")}}function wt(n,l){if(n&1){let e=w();_(0,"span",9,1),v("keydown",function(t){c(e);let a=r();return u(a.onKeyDown(t,0))})("mousedown",function(t){c(e);let a=r();return u(a.onMouseDown(t,0))})("touchstart",function(t){c(e);let a=r();return u(a.onDragStart(t,0))})("touchmove",function(t){c(e);let a=r();return u(a.onDrag(t))})("touchend",function(t){c(e);let a=r();return u(a.onDragEnd(t))}),b()}if(n&2){let e=r();p(e.cn(e.cx("handle"),e.handleIndex==0&&"p-slider-handle-active")),j("transition",e.dragging?"none":null),o("ngStyle",E(14,J,e.rangeStartLeft,e.rangeStartBottom))("pAutoFocus",e.autofocus),g("tabindex",e.$disabled()?null:e.tabindex)("aria-valuemin",e.min)("aria-valuenow",e.value?e.value[0]:null)("aria-valuemax",e.max)("aria-labelledby",e.ariaLabelledBy)("aria-label",e.ariaLabel)("aria-orientation",e.orientation)("data-pc-section","startHandler")}}function Vt(n,l){if(n&1){let e=w();_(0,"span",10,2),v("keydown",function(t){c(e);let a=r();return u(a.onKeyDown(t,1))})("mousedown",function(t){c(e);let a=r();return u(a.onMouseDown(t,1))})("touchstart",function(t){c(e);let a=r();return u(a.onDragStart(t,1))})("touchmove",function(t){c(e);let a=r();return u(a.onDrag(t))})("touchend",function(t){c(e);let a=r();return u(a.onDragEnd(t))}),b()}if(n&2){let e=r();p(e.cn(e.cx("handle"),e.handleIndex==1&&"p-slider-handle-active")),j("transition",e.dragging?"none":null),o("ngStyle",E(13,J,e.rangeEndLeft,e.rangeEndBottom)),g("tabindex",e.$disabled()?null:e.tabindex)("aria-valuemin",e.min)("aria-valuenow",e.value?e.value[1]:null)("aria-valuemax",e.max)("aria-labelledby",e.ariaLabelledBy)("aria-label",e.ariaLabel)("aria-orientation",e.orientation)("data-pc-section","endHandler")}}var Ct={handle:{position:"absolute"},range:{position:"absolute"}},Tt={root:({instance:n})=>["p-slider p-component",{"p-disabled":n.$disabled(),"p-invalid":n.invalid(),"p-slider-horizontal":n.orientation==="horizontal","p-slider-vertical":n.orientation==="vertical","p-slider-animate":n.animate}],range:"p-slider-range",handle:"p-slider-handle"},De=(()=>{class n extends q{name="slider";theme=ke;classes=Tt;inlineStyles=Ct;static \u0275fac=(()=>{let e;return function(t){return(e||(e=k(n)))(t||n)}})();static \u0275prov=M({token:n,factory:n.\u0275fac})}return n})();var St={provide:ce,useExisting:ee(()=>Ee),multi:!0},Ee=(()=>{class n extends Ce{animate;min=0;max=100;orientation="horizontal";step;range;styleClass;ariaLabel;ariaLabelledBy;tabindex=0;autofocus;onChange=new S;onSlideEnd=new S;sliderHandle;sliderHandleStart;sliderHandleEnd;_componentStyle=I(De);value;values;handleValue;handleValues=[];diff;offset;bottom;dragging;dragListener;mouseupListener;initX;initY;barWidth;barHeight;sliderHandleClick;handleIndex=0;startHandleValue;startx;starty;ngZone=I(te);onHostClick(e){this.onBarClick(e)}onMouseDown(e,i){this.$disabled()||(this.dragging=!0,this.updateDomData(),this.sliderHandleClick=!0,this.range&&this.handleValues&&this.handleValues[0]===this.max?this.handleIndex=0:this.handleIndex=i,this.bindDragListeners(),e.target.focus(),e.preventDefault(),this.animate&&U(this.el.nativeElement,"p-slider-animate"))}onDragStart(e,i){if(!this.$disabled()){var t=e.changedTouches[0];this.startHandleValue=this.range?this.handleValues[i]:this.handleValue,this.dragging=!0,this.range&&this.handleValues&&this.handleValues[0]===this.max?this.handleIndex=0:this.handleIndex=i,this.orientation==="horizontal"?(this.startx=parseInt(t.clientX,10),this.barWidth=this.el.nativeElement.offsetWidth):(this.starty=parseInt(t.clientY,10),this.barHeight=this.el.nativeElement.offsetHeight),this.animate&&U(this.el.nativeElement,"p-slider-animate"),e.preventDefault()}}onDrag(e){if(!this.$disabled()){var i=e.changedTouches[0],t=0;this.orientation==="horizontal"?t=Math.floor((parseInt(i.clientX,10)-this.startx)*100/this.barWidth)+this.startHandleValue:t=Math.floor((this.starty-parseInt(i.clientY,10))*100/this.barHeight)+this.startHandleValue,this.setValueFromHandle(e,t),e.preventDefault()}}onDragEnd(e){this.$disabled()||(this.dragging=!1,this.range?this.onSlideEnd.emit({originalEvent:e,values:this.values}):this.onSlideEnd.emit({originalEvent:e,value:this.value}),this.animate&&G(this.el.nativeElement,"p-slider-animate"),e.preventDefault())}onBarClick(e){this.$disabled()||(this.sliderHandleClick||(this.updateDomData(),this.handleChange(e),this.range?this.onSlideEnd.emit({originalEvent:e,values:this.values}):this.onSlideEnd.emit({originalEvent:e,value:this.value})),this.sliderHandleClick=!1)}onKeyDown(e,i){switch(this.handleIndex=i,e.code){case"ArrowDown":case"ArrowLeft":this.decrementValue(e,i),e.preventDefault();break;case"ArrowUp":case"ArrowRight":this.incrementValue(e,i),e.preventDefault();break;case"PageDown":this.decrementValue(e,i,!0),e.preventDefault();break;case"PageUp":this.incrementValue(e,i,!0),e.preventDefault();break;case"Home":this.updateValue(this.min,e),e.preventDefault();break;case"End":this.updateValue(this.max,e),e.preventDefault();break;default:break}}decrementValue(e,i,t=!1){let a;this.range?this.step?a=(this.values?.[i]??0)-this.step:a=(this.values?.[i]??0)-1:this.step?a=this.value-this.step:!this.step&&t?a=this.value-10:a=this.value-1,this.updateValue(a,e),e.preventDefault()}incrementValue(e,i,t=!1){let a;this.range?this.step?a=(this.values?.[i]??0)+this.step:a=(this.values?.[i]??0)+1:this.step?a=this.value+this.step:!this.step&&t?a=this.value+10:a=this.value+1,this.updateValue(a,e),e.preventDefault()}handleChange(e){let i=this.calculateHandleValue(e);this.setValueFromHandle(e,i)}bindDragListeners(){de(this.platformId)&&this.ngZone.runOutsideAngular(()=>{let e=this.el?this.el.nativeElement.ownerDocument:this.document;this.dragListener||(this.dragListener=this.renderer.listen(e,"mousemove",i=>{this.dragging&&this.ngZone.run(()=>{this.handleChange(i)})})),this.mouseupListener||(this.mouseupListener=this.renderer.listen(e,"mouseup",i=>{this.dragging&&(this.dragging=!1,this.ngZone.run(()=>{this.range?this.onSlideEnd.emit({originalEvent:i,values:this.values}):this.onSlideEnd.emit({originalEvent:i,value:this.value}),this.animate&&G(this.el.nativeElement,"p-slider-animate")}))}))})}unbindDragListeners(){this.dragListener&&(this.dragListener(),this.dragListener=null),this.mouseupListener&&(this.mouseupListener(),this.mouseupListener=null)}setValueFromHandle(e,i){let t=this.getValueFromHandle(i);this.range?this.step?this.handleStepChange(t,this.values[this.handleIndex]):(this.handleValues[this.handleIndex]=i,this.updateValue(t,e)):this.step?this.handleStepChange(t,this.value):(this.handleValue=i,this.updateValue(t,e)),this.cd.markForCheck()}handleStepChange(e,i){let t=e-i,a=i,s=this.step;t<0?a=i+Math.ceil(e/s-i/s)*s:t>0&&(a=i+Math.floor(e/s-i/s)*s),this.updateValue(a),this.updateHandleValue()}get rangeStartLeft(){return this.isVertical()?null:this.handleValues[0]>100?"100%":this.handleValues[0]+"%"}get rangeStartBottom(){return this.isVertical()?this.handleValues[0]+"%":"auto"}get rangeEndLeft(){return this.isVertical()?null:this.handleValues[1]+"%"}get rangeEndBottom(){return this.isVertical()?this.handleValues[1]+"%":"auto"}isVertical(){return this.orientation==="vertical"}updateDomData(){let e=this.el.nativeElement.getBoundingClientRect();this.initX=e.left+ue(),this.initY=e.top+pe(),this.barWidth=this.el.nativeElement.offsetWidth,this.barHeight=this.el.nativeElement.offsetHeight}calculateHandleValue(e){return this.orientation==="horizontal"?he(this.el.nativeElement)?(this.initX+this.barWidth-e.pageX)*100/this.barWidth:(e.pageX-this.initX)*100/this.barWidth:(this.initY+this.barHeight-e.pageY)*100/this.barHeight}updateHandleValue(){this.range?(this.handleValues[0]=(this.values[0]<this.min?0:this.values[0]-this.min)*100/(this.max-this.min),this.handleValues[1]=(this.values[1]>this.max?100:this.values[1]-this.min)*100/(this.max-this.min)):this.value<this.min?this.handleValue=0:this.value>this.max?this.handleValue=100:this.handleValue=(this.value-this.min)*100/(this.max-this.min),this.step&&this.updateDiffAndOffset()}updateDiffAndOffset(){this.diff=this.getDiff(),this.offset=this.getOffset()}getDiff(){return Math.abs(this.handleValues[0]-this.handleValues[1])}getOffset(){return Math.min(this.handleValues[0],this.handleValues[1])}updateValue(e,i){if(this.range){let t=e;this.handleIndex==0?(t<this.min?(t=this.min,this.handleValues[0]=0):t>this.values[1]&&t>this.max&&(t=this.max,this.handleValues[0]=100),this.sliderHandleStart?.nativeElement.focus()):(t>this.max?(t=this.max,this.handleValues[1]=100,this.offset=this.handleValues[1]):t<this.min?(t=this.min,this.handleValues[1]=0):t<this.values[0]&&(this.offset=this.handleValues[1]),this.sliderHandleEnd?.nativeElement.focus()),this.step?this.updateHandleValue():this.updateDiffAndOffset(),this.values[this.handleIndex]=this.getNormalizedValue(t);let a=[this.minVal,this.maxVal];this.onModelChange(a),this.onChange.emit({event:i,values:this.values})}else e<this.min?(e=this.min,this.handleValue=0):e>this.max&&(e=this.max,this.handleValue=100),this.value=this.getNormalizedValue(e),this.onModelChange(this.value),this.onChange.emit({event:i,value:this.value}),this.sliderHandle?.nativeElement.focus();this.updateHandleValue()}getValueFromHandle(e){return(this.max-this.min)*(e/100)+this.min}getDecimalsCount(e){return e&&Math.floor(e)!==e&&e.toString().split(".")[1].length||0}getNormalizedValue(e){let i=this.getDecimalsCount(this.step);return i>0?+parseFloat(e.toString()).toFixed(i):Math.floor(e)}ngOnDestroy(){this.unbindDragListeners(),super.ngOnDestroy()}get minVal(){return Math.min(this.values[1],this.values[0])}get maxVal(){return Math.max(this.values[1],this.values[0])}writeControlValue(e){this.range?this.values=e||[0,0]:this.value=e||0,this.updateHandleValue(),this.updateDiffAndOffset(),this.cd.markForCheck()}static \u0275fac=(()=>{let e;return function(t){return(e||(e=k(n)))(t||n)}})();static \u0275cmp=P({type:n,selectors:[["p-slider"]],viewQuery:function(i,t){if(i&1&&(D(ct,5),D(ut,5),D(pt,5)),i&2){let a;m(a=f())&&(t.sliderHandle=a.first),m(a=f())&&(t.sliderHandleStart=a.first),m(a=f())&&(t.sliderHandleEnd=a.first)}},hostVars:4,hostBindings:function(i,t){i&1&&v("click",function(s){return t.onHostClick(s)}),i&2&&(g("data-pc-name","slider")("data-pc-section","root"),p(t.cn(t.cx("root"),t.styleClass)))},inputs:{animate:[2,"animate","animate",C],min:[2,"min","min",H],max:[2,"max","max",H],orientation:"orientation",step:[2,"step","step",H],range:[2,"range","range",C],styleClass:"styleClass",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy",tabindex:[2,"tabindex","tabindex",H],autofocus:[2,"autofocus","autofocus",C]},outputs:{onChange:"onChange",onSlideEnd:"onSlideEnd"},features:[z([St,De]),L],decls:7,vars:7,consts:[["sliderHandle",""],["sliderHandleStart",""],["sliderHandleEnd",""],[3,"class","ngStyle",4,"ngIf"],["role","slider",3,"class","transition","ngStyle","pAutoFocus","touchstart","touchmove","touchend","mousedown","keydown",4,"ngIf"],["role","slider",3,"transition","class","ngStyle","pAutoFocus","keydown","mousedown","touchstart","touchmove","touchend",4,"ngIf"],["role","slider",3,"transition","class","ngStyle","keydown","mousedown","touchstart","touchmove","touchend",4,"ngIf"],[3,"ngStyle"],["role","slider",3,"touchstart","touchmove","touchend","mousedown","keydown","ngStyle","pAutoFocus"],["role","slider",3,"keydown","mousedown","touchstart","touchmove","touchend","ngStyle","pAutoFocus"],["role","slider",3,"keydown","mousedown","touchstart","touchmove","touchend","ngStyle"]],template:function(i,t){i&1&&h(0,_t,1,7,"span",3)(1,bt,1,7,"span",3)(2,vt,1,6,"span",3)(3,yt,1,6,"span",3)(4,xt,2,17,"span",4)(5,wt,2,17,"span",5)(6,Vt,2,16,"span",6),i&2&&(o("ngIf",t.range&&t.orientation=="horizontal"),d(),o("ngIf",t.range&&t.orientation=="vertical"),d(),o("ngIf",!t.range&&t.orientation=="vertical"),d(),o("ngIf",!t.range&&t.orientation=="horizontal"),d(),o("ngIf",!t.range),d(),o("ngIf",t.range),d(),o("ngIf",t.range))},dependencies:[N,W,le,be,T],encapsulation:2,changeDetection:0})}return n})(),_n=(()=>{class n{static \u0275fac=function(i){return new(i||n)};static \u0275mod=B({type:n});static \u0275inj=F({imports:[Ee,T,T]})}return n})();export{dt as a,Yt as b,Ee as c,_n as d};
