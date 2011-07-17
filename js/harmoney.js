$(document).ready(function(){
	$.MyHarmony = {
		canvas: null,
		context: null,
		width: $(window).width(),
		height: $(window).height(),
		max_line: 35,
		user_list: [],
		user_pos: [],
		timer: null,
		lastTime: 0,
		fps: 0,
		init: function(){
			var that = this;
		
			$('body').append('<canvas id="harmonyCanvas" style="position:absolute;left:0;top:0;z-index: 10;" width="'+this.width+'" height="'+this.height+'"></canvas>');
	        
	        this.canvas = document.getElementById('harmonyCanvas');
	        
	        this.context = this.canvas.getContext("2d");
	        this.context.globalCompositeOperation = "lighter";
	        this.context.lineWidth = 0.2;
	        this.context.font = "16px 'MS PGothic'";
	        //this.canvas.onmousedown = this.reset;
	        
	        window.requestAnimFrame = (function(){
	            return  window.requestAnimationFrame       || 
	                    window.webkitRequestAnimationFrame || 
	                    window.mozRequestAnimationFrame    || 
	                    window.oRequestAnimationFrame      || 
	                    window.msRequestAnimationFrame     || 
	                    function(/* function */ callback, /* DOMElement */ element){
	                      window.setTimeout(callback, 1000 / 60);
	                    };
	        })();
	        
	        function animationLoop(){
	        	that.render(that);
	        	requestAnimFrame(animationLoop);
	        }
	        animationLoop();
	        
	        for (var i = 0; i < 6; i++) {
	        	that.addParticle('particle' + i);
	        }
	        
	        $(document).mousemove(function(e){
	            for (key in that.user_list) {
	                that.user_pos[key] = {x: e.pageX - (Math.random() * 5 * 100) + 250, y: e.pageY - (Math.random() * 5 * 100) + 250};
	            }
	        });
		},
		addParticle: function(name){
			var i = this.max_line;
	        
			this.user_list[name] = new Array();
			this.user_pos[name] = {x: this.width/2, y: this.height/2};
	        
	        while(i--){
	            var p = this.createParticle(i);
	            this.user_list[name].push(p);
	        }
		},
		reset: function(){
			this.context.clearRect(0,0,this.width,this.height);
		},
		createParticle: function(id){
			var p = new Object();
	        
	        p.oldx = this.width/2;
	        p.oldy = this.height/2;
	        
	        p.newx = this.width/2;
	        p.newy = this.height/2;
	        
	        p.difx = 0;
	        p.dify = 0;
	        
	        p.inertia = 0;
	        p.k = 0.05;
	        
	        p.inertia = 0.85 - id * 0.01;
	        
	        p.colB = Math.floor(Math.random() * 128 + 128);
	        p.colG = Math.floor(Math.random() * (p.colB * 0.8) + p.colB * 0.105);
	        p.colR = Math.floor(Math.random() * (p.colG * 0.8) + p.colG * 0.105);
	        p.colA = 1;
	        
	        return p;
		},
		setUserPos: function(key, pos){
			this.user_pos[key] = pos;
		},
		getUserPos: function(){
			return this.user_pos;
		},
		setUserList: function(k, i, p){
			this.user_list[k][i] = p;
		},
		getUserList: function(){
			return this.user_list;
		},
		render: function(that){
			var currentTime = new Date().getTime();
			var dt = (currentTime - this.lastTime) / 1000;
			this.lastTime = currentTime;
			this.fps = Math.round(1 / dt);
			
			var pos = this.getUserPos();
			var list = this.getUserList();
			
			for (key in list){
	            var i = list[key].length;
	            while(i--){
	                var p = list[key][i];
	                
	                p.difx = p.difx * p.inertia + (pos[key].x - p.oldx) * p.k;
	                p.dify = p.dify * p.inertia + (pos[key].y - p.oldy) * p.k;
	                
	                this.context.beginPath();
	                
	                this.context.strokeStyle = 'rgba(' + p.colR + ',' + p.colG + ',' + p.colB + ',' + p.colA + ')';
	                this.context.moveTo(p.oldx, p.oldy);
	                
	                p.newx += p.difx;
	                p.newy += p.dify;

	                this.context.lineTo(p.newx, p.newy);
	                p.oldx = p.newx;
	                p.oldy = p.newy;
	                
	                this.context.closePath();
	                this.context.stroke();
	                
	                this.setUserList(key, i, p);
	            }
	        }
		}
	};
	
	$.MyHarmony.init();
	
});