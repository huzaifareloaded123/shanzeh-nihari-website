"use strict";
const MENU = [{"id": 1, "name": "Single Nihari", "price": 500, "image": "single-nihari.webp"}, {"id": 2, "name": "Single Nihari Fry", "price": 600, "image": "single-nihari-fry.webp"}, {"id": 3, "name": "Double Nihari", "price": 1050, "image": "double-nihari.webp"}, {"id": 4, "name": "Nalli Nihari", "price": 800, "image": "nalli-nihari.webp"}, {"id": 5, "name": "Maghaz Nihari", "price": 800, "image": "maghaz-nihari.webp"}, {"id": 6, "name": "Desi Ghee Tarka", "price": 150, "image": "desi-ghee-tarka.webp"}, {"id": 7, "name": "Single Special Nihari", "price": 1350, "image": "single-special-nihari.webp"}, {"id": 8, "name": "Special Nihari Thaal", "price": 1850, "image": "special-nihari-thaal.webp"}, {"id": 9, "name": "Beef Pulao", "price": 450, "image": "beef-pulao.webp"}, {"id": 10, "name": "Chana Pulao", "price": 300, "image": "chana-pulao.webp"}, {"id": 11, "name": "Chicken Biryani", "price": 380, "image": "chicken-biryani.webp"}, {"id": 12, "name": "Halwa Puri", "price": 250, "image": "halwa-puri.webp"}, {"id": 13, "name": "Paye", "price": 220, "image": "paye.webp"}];
const CART_KEY = "shanzehCheckoutCart";
const $ = id => document.getElementById(id);
const money = value => "Rs. " + value.toLocaleString("en-PK");
let cart = [];
try { const data = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); if(Array.isArray(data)) cart = data.filter(([id,q])=>MENU.some(p=>p.id===Number(id)) && Number.isInteger(q) && q>0 && q<=99).map(([id,q])=>[Number(id),q]); } catch(_){}
let preference = null;
try { preference = JSON.parse(localStorage.getItem("shanzehOrderPreference") || "null"); } catch(_){}
const pickup = preference?.type === "pickup";
const deliveryFee = pickup ? 0 : 200;
$("orderMode").firstChild.textContent = pickup ? "🏪   Pickup Order" : "🛵   Delivery Order";
$("paymentChoice").querySelector("strong").textContent = pickup ? "Cash on Pickup" : "Cash on Delivery";
if (pickup) { $("addressGroup").querySelector("label").innerHTML = "Pickup Notes (Optional)"; $("address").placeholder = "Optional pickup instructions"; $("instructions").placeholder = "Any special instructions?"; }
if (!pickup && preference) { const area = preference.area || preference.location || preference.address || preference.selectedArea || ""; if(typeof area === "string") $("selectedArea").textContent = area; }
const rows = cart.map(([id,quantity])=>({product:MENU.find(p=>p.id===id),quantity})).filter(r=>r.product);
const subtotal = rows.reduce((sum,r)=>sum+r.product.price*r.quantity,0);
const fee = rows.length ? deliveryFee : 0;
$("count").textContent = `${rows.reduce((s,r)=>s+r.quantity,0)} item(s)`;
$("subtotal").textContent = money(subtotal);
$("fee").textContent = money(fee);
$("grand").textContent = money(subtotal+fee);
const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
$("items").innerHTML = rows.length ? rows.map(({product:p,quantity:q})=>`<div class="item"><img class="photo" src="${p.image}" alt="${escapeHtml(p.name)}" onerror="this.outerHTML='<div class=&quot;photo photo-fallback&quot;>🍲</div>'"><div class="item-body"><div class="item-name">${q} × ${escapeHtml(p.name)}</div><div class="item-meta">Rs. ${p.price.toLocaleString('en-PK')} each</div><div class="item-price">${money(p.price*q)}</div></div></div>`).join("") : '<p>Your cart is empty. <a href="index.html#menu">Browse the menu</a>.</p>';
for(const id of ["phone","alternatePhone"]) $(id).addEventListener("input",e=>e.target.value=e.target.value.replace(/\D/g,"").slice(0,11));
function message(text){$("message").textContent=text;$("mobileMessage").textContent=text;}
$("orderForm").addEventListener("submit",e=>{
 e.preventDefault(); message("");
 if(!rows.length){message("Your cart is empty. Please add items first.");return;}
 if(!/^\d{11}$/.test($("phone").value)){message("Please Enter a valid phone number");$("phone").focus();return;}
 const alt=$("alternatePhone").value;
 if(alt && !/^\d{11}$/.test(alt)){message("Please enter a valid alternate phone number");$("alternatePhone").focus();return;}
 if(!$("fullName").value.trim()){message("Please enter your full name.");$("fullName").focus();return;}
 if(!pickup && !$("address").value.trim()){message("Please enter your delivery address.");$("address").focus();return;}
 if($("email").value && !$("email").checkValidity()){message("Please enter a valid email address.");$("email").focus();return;}
 message("Demo only: your details were checked, but no order was sent. Online ordering will be activated later.");
});