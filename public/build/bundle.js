
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    let SvelteElement;
    if (typeof HTMLElement === 'function') {
        SvelteElement = class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }
            connectedCallback() {
                // @ts-ignore todo: improve typings
                for (const key in this.$$.slotted) {
                    // @ts-ignore todo: improve typings
                    this.appendChild(this.$$.slotted[key]);
                }
            }
            attributeChangedCallback(attr, _oldValue, newValue) {
                this[attr] = newValue;
            }
            $destroy() {
                destroy_component(this, 1);
                this.$destroy = noop;
            }
            $on(type, callback) {
                // TODO should this delegate to addEventListener?
                const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
                callbacks.push(callback);
                return () => {
                    const index = callbacks.indexOf(callback);
                    if (index !== -1)
                        callbacks.splice(index, 1);
                };
            }
            $set($$props) {
                if (this.$$set && !is_empty($$props)) {
                    this.$$.skip_bound = true;
                    this.$$set($$props);
                    this.$$.skip_bound = false;
                }
            }
        };
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.4' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }

    /* src/Footer.svelte generated by Svelte v3.29.4 */

    const file = "src/Footer.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (72:6) {#each lista.value as value}
    function create_each_block_1(ctx) {
    	let p;
    	let t_value = /*value*/ ctx[4] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			add_location(p, file, 72, 7, 1552);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(72:6) {#each lista.value as value}",
    		ctx
    	});

    	return block;
    }

    // (66:3) {#each social.list as lista}
    function create_each_block(ctx) {
    	let div1;
    	let span;
    	let t0_value = /*lista*/ ctx[1].class + "";
    	let t0;
    	let t1;
    	let div0;
    	let t2;
    	let each_value_1 = /*lista*/ ctx[1].value;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			attr_dev(span, "class", "material-icons");
    			add_location(span, file, 67, 5, 1413);
    			attr_dev(div0, "class", "text-container");
    			add_location(div0, file, 70, 5, 1481);
    			attr_dev(div1, "class", "social");
    			add_location(div1, file, 66, 4, 1387);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span);
    			append_dev(span, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*social*/ 1) {
    				each_value_1 = /*lista*/ ctx[1].value;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(66:3) {#each social.list as lista}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let link0;
    	let link1;
    	let t0;
    	let main;
    	let div3;
    	let figure;
    	let img;
    	let img_src_value;
    	let t1;
    	let div1;
    	let div0;
    	let h5;
    	let t3;
    	let div2;
    	let each_value = /*social*/ ctx[0].list;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			link1 = element("link");
    			t0 = space();
    			main = element("main");
    			div3 = element("div");
    			figure = element("figure");
    			img = element("img");
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			h5 = element("h5");
    			h5.textContent = "Oficina Asesora de Sistemas";
    			t3 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			this.c = noop;
    			attr_dev(link0, "href", "https://fonts.googleapis.com/icon?family=Material+Icons");
    			attr_dev(link0, "rel", "stylesheet");
    			add_location(link0, file, 40, 1, 737);
    			attr_dev(link1, "href", "https://fonts.googleapis.com/css2?family=Open+Sans&display=swap");
    			attr_dev(link1, "rel", "stylesheet");
    			add_location(link1, file, 43, 1, 831);
    			if (img.src !== (img_src_value = "https://pruebasassets.portaloas.udistrital.edu.co/logo_universidad_acreditacion_inverse.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "card-image");
    			attr_dev(img, "alt", "logo-udistrital");
    			add_location(img, file, 52, 3, 1026);
    			attr_dev(figure, "class", "card-imageContainer");
    			add_location(figure, file, 51, 2, 986);
    			add_location(h5, file, 59, 4, 1261);
    			attr_dev(div0, "class", "footer-title");
    			add_location(div0, file, 58, 3, 1230);
    			attr_dev(div1, "class", "footer-column");
    			add_location(div1, file, 57, 2, 1199);
    			attr_dev(div2, "class", "footer-logos");
    			add_location(div2, file, 63, 2, 1320);
    			attr_dev(div3, "class", "footer-div");
    			add_location(div3, file, 49, 1, 956);
    			add_location(main, file, 48, 0, 948);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link0);
    			append_dev(document.head, link1);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, figure);
    			append_dev(figure, img);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h5);
    			append_dev(div3, t3);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*social*/ 1) {
    				each_value = /*social*/ ctx[0].list;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(link0);
    			detach_dev(link1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("svelte-footer", slots, []);

    	let social = {
    		list: [
    			{
    				title: "Horario ",
    				//class: "time",
    				class: "access_time",
    				value: ["Lunes a viernes", "8am a 5pm"]
    			},
    			{
    				title: "Nombre",
    				//class: "globe",
    				class: "language",
    				value: ["Sistema Integrado de informática y  Telecomunicaciones "]
    			},
    			{
    				title: "Phone",
    				class: "call",
    				value: ["323 93 00", "Ext. 1112"]
    			},
    			{
    				title: "Direccion",
    				//class: "pin",
    				class: "place",
    				value: ["Cra 8 # 40-78", "Piso 1"]
    			},
    			{
    				title: "mail",
    				//class: "at",
    				class: "alternate_email",
    				value: ["computo@udistrital.edu.co"]
    			}
    		]
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<svelte-footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ social });

    	$$self.$inject_state = $$props => {
    		if ("social" in $$props) $$invalidate(0, social = $$props.social);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [social];
    }

    class Footer extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>@import url("https://pruebasassets.portaloas.udistrital.edu.co/font-style.css");.footer-div{background-color:#2b3643;width:100%;display:flex;justify-content:center;flex-wrap:wrap;margin-top:1%;box-shadow:2px -2px 11px #888888;position:fixed;bottom:0;left:0}.card-imageContainer{object-fit:cover;margin:0;border-right:0.1rem solid white;align-self:center}.text-container{align-self:center}.card-image{width:230px}.footer-column{color:white;width:10%;margin-top:1%;align-self:center;margin-right:3%}.footer-title{text-align:center}h5{font-family:"Open Sans" !important;margin-bottom:0.5rem;font-size:1rem;font-family:Exo;margin-top:0;color:white}.footer-logos{display:flex;justify-content:center;flex-wrap:wrap;width:65%}.social{display:flex;padding-left:5px;padding-right:5px;color:white;justify-content:center;width:18%;align-self:center}.material-icons{font-size:32px;align-self:center;margin-right:10px}p{font-size:13px;text-align:center;margin:0;font-family:"Open Sans"}@media screen and (max-width: 1132px){.social{width:20%}p{font-size:13px}.footer-column{margin-right:0}}@media screen and (max-width: 930px){.social{width:30%}.footer-logos{width:50%}}@media screen and (max-width: 768px){.social{width:40%}}@media screen and (max-width: 620px){.social{width:40%}.footer-logos{width:100%}.footer-column{width:30%}}@media screen and (max-width: 330px){.card-image{width:200px}h5{font-size:15px}}</style>`;
    		init(this, { target: this.shadowRoot }, instance, create_fragment, safe_not_equal, {});

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}
    		}
    	}
    }

    customElements.define("svelte-footer", Footer);

    /* src/Header.svelte generated by Svelte v3.29.4 */

    const file$1 = "src/Header.svelte";

    function create_fragment$1(ctx) {
    	let link;
    	let t0;
    	let main;
    	let div2;
    	let div1;
    	let div0;
    	let t1;
    	let div8;
    	let div3;
    	let i0;
    	let t2;
    	let div5;
    	let i1;
    	let t3;
    	let div4;
    	let t5;
    	let div7;
    	let i2;
    	let t6;
    	let p0;
    	let t8;
    	let i3;
    	let t9;
    	let div6;
    	let p1;

    	const block = {
    		c: function create() {
    			link = element("link");
    			t0 = space();
    			main = element("main");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div8 = element("div");
    			div3 = element("div");
    			i0 = element("i");
    			t2 = space();
    			div5 = element("div");
    			i1 = element("i");
    			t3 = space();
    			div4 = element("div");
    			div4.textContent = `${/*notificacion*/ ctx[0].no_vistos}`;
    			t5 = space();
    			div7 = element("div");
    			i2 = element("i");
    			t6 = space();
    			p0 = element("p");
    			p0.textContent = "token.sub";
    			t8 = space();
    			i3 = element("i");
    			t9 = space();
    			div6 = element("div");
    			p1 = element("p");
    			p1.textContent = "cerrar sesion";
    			this.c = noop;
    			attr_dev(link, "href", "https://pruebasassets.portaloas.udistrital.edu.co/logo-header.css");
    			attr_dev(link, "rel", "stylesheet");
    			add_location(link, file$1, 152, 1, 2587);
    			attr_dev(div0, "class", "logo-header");
    			attr_dev(div0, "id", "core-header");
    			add_location(div0, file$1, 163, 3, 2883);
    			attr_dev(div1, "class", "logo-containter");
    			add_location(div1, file$1, 159, 2, 2747);
    			attr_dev(div2, "class", "header-container");
    			add_location(div2, file$1, 158, 1, 2714);
    			attr_dev(i0, "id", "header-user-icon");
    			attr_dev(i0, "class", "fa fa-th-large");
    			add_location(i0, file$1, 168, 12, 3079);
    			attr_dev(div3, "class", "header-button-apps-container");
    			attr_dev(div3, "onclick", "toogleAplicaciones()");
    			add_location(div3, file$1, 167, 8, 2993);
    			attr_dev(i1, "class", "fa fa-bell-o");
    			add_location(i1, file$1, 171, 12, 3233);
    			attr_dev(div4, "class", "header-badge");
    			add_location(div4, file$1, 172, 12, 3274);
    			attr_dev(div5, "class", "header-button-notification");
    			attr_dev(div5, "onclick", "togglenotify()");
    			add_location(div5, file$1, 170, 8, 3155);
    			attr_dev(i2, "id", "header-user-icon");
    			attr_dev(i2, "class", "fa fa-user-o");
    			add_location(i2, file$1, 177, 12, 3507);
    			attr_dev(p0, "class", "user-info");
    			add_location(p0, file$1, 178, 12, 3570);
    			attr_dev(i3, "class", "fa fa-chevron-down");
    			add_location(i3, file$1, 179, 12, 3617);
    			add_location(p1, file$1, 181, 16, 3747);
    			attr_dev(div6, "id", "header-button-cerrarsesion-container");
    			attr_dev(div6, "onclick", "logout()");
    			add_location(div6, file$1, 180, 12, 3664);
    			attr_dev(div7, "class", "header-button-user-container");
    			attr_dev(div7, "onclick", "toogleCerrarSesion()");
    			attr_dev(div7, "ng-show", "token_service.live_token()");
    			add_location(div7, file$1, 176, 8, 3384);
    			attr_dev(div8, "class", "header-buttons-container");
    			add_location(div8, file$1, 166, 1, 2946);
    			add_location(main, file$1, 157, 0, 2706);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(main, t1);
    			append_dev(main, div8);
    			append_dev(div8, div3);
    			append_dev(div3, i0);
    			append_dev(div8, t2);
    			append_dev(div8, div5);
    			append_dev(div5, i1);
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    			append_dev(div8, t5);
    			append_dev(div8, div7);
    			append_dev(div7, i2);
    			append_dev(div7, t6);
    			append_dev(div7, p0);
    			append_dev(div7, t8);
    			append_dev(div7, i3);
    			append_dev(div7, t9);
    			append_dev(div7, div6);
    			append_dev(div6, p1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(link);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("svelte-header", slots, []);
    	let notificacion = { no_vistos: 0 };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<svelte-header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ notificacion });

    	$$self.$inject_state = $$props => {
    		if ("notificacion" in $$props) $$invalidate(0, notificacion = $$props.notificacion);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [notificacion];
    }

    class Header extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>@import url("https://pruebasassets.portaloas.udistrital.edu.co/logo-header.css");i{color:var(--primary)}.header-container{width:100%;display:flex;justify-content:center;flex-wrap:wrap;z-index:3;background-color:white;flex-shrink:0;align-items:center;justify-content:space-between;margin-top:0px;padding-left:10px;box-shadow:0 0.5rem 1rem 0 rgba(44, 51, 73, 0.1)}.header-buttons-container{width:50%;display:flex;justify-content:flex-end;flex-wrap:wrap;align-items:center}.header-button-notification{font-size:25px;font-family:"Lucida Sans";padding:8px 15px;width:70px;height:50px;cursor:pointer;color:var(--primary)}.header-button-user-container{display:flex;justify-content:center;align-items:center}.header-button-user-container>p{margin:8px;color:var(--primary)}#header-button-cerrarsesion-container{position:absolute;top:60px;right:10px;z-index:10;display:none;border-radius:15px;background-color:#fff;box-shadow:0px 0px 9px -2px rgba(0, 0, 0, 0.84);width:118px;height:23px;text-align:center}#header-user-icon{font-size:25px;width:36px}.header-badge{position:relative;top:-45px;right:-22px;font-size:0.7em;background:var(--primary);color:white;width:25px;height:25px;text-align:center;line-height:25px;border-radius:50%}@media screen and (max-width: 855px){.user-info{display:none}.header-button-user-container{width:70px}}@media screen and (max-width: 425px){.user-info{display:none}.header-buttons-container{width:70%}}</style>`;
    		init(this, { target: this.shadowRoot }, instance$1, create_fragment$1, safe_not_equal, {});

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}
    		}
    	}
    }

    customElements.define("svelte-header", Header);

    var main = {Footer,Header};

    return main;

}());
//# sourceMappingURL=bundle.js.map
