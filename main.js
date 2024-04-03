 // Constants
 const NUM_BLOBS = 3;
 const MAX_SPEED = 3;
 const MAX_SIZE = 50;
 const MIN_SIZE = 20;
 const COLORS = ["red", "green", "blue"];

 class Blob {
     constructor(x, y, size, color) {
         this.x = x;
         this.y = y;
         this.size = size;
         this.color = color;
         this.vx = 0;
         this.vy = 0;
     }

     update() {
         this.x += this.vx;
         this.y += this.vy;
     }

     checkBoundaryCollision(canvas) {
         if (this.x - this.size / 2 < 0 || this.x + this.size / 2 > canvas.width) {
             this.vx *= -1;
         }
         if (this.y - this.size / 2 < 0 || this.y + this.size / 2 > canvas.height) {
             this.vy *= -1;
         }
     }

     checkBlobCollision(otherBlob) {
         const dx = this.x - otherBlob.x;
         const dy = this.y - otherBlob.y;
         const distance = Math.sqrt(dx ** 2 + dy ** 2);
         if (distance < this.size / 2 + otherBlob.size / 2) {
             const overlap = (this.size / 2 + otherBlob.size / 2) - distance;
             this.size -= overlap / 2;
             otherBlob.size -= overlap / 2;

             const angle = Math.atan2(dy, dx);
             const overlapX = overlap * Math.cos(angle);
             const overlapY = overlap * Math.sin(angle);
             this.x += overlapX / 2;
             this.y += overlapY / 2;
             otherBlob.x -= overlapX / 2;
             otherBlob.y -= overlapY / 2;
         }
     }
 }

 function initializeBlobs(canvas) {
     const blobs = [];
     for (let i = 0; i < NUM_BLOBS; i++) {
         const x = Math.random() * canvas.width;
         const y = Math.random() * canvas.height;
         const size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
         const color = COLORS[i];
         blobs.push(new Blob(x, y, size, color));
     }
     return blobs;
 }

 function animate(canvas, ctx, blobs) {
     ctx.clearRect(0, 0, canvas.width, canvas.height);
     for (const blob of blobs) {
         blob.update();
         blob.checkBoundaryCollision(canvas);
         ctx.beginPath();
         ctx.arc(blob.x, blob.y, blob.size / 2, 0, Math.PI * 2);
         ctx.fillStyle = blob.color;
         ctx.fill();
     }

     for (let i = 0; i < blobs.length; i++) {
         for (let j = i + 1; j < blobs.length; j++) {
             blobs[i].checkBlobCollision(blobs[j]);
         }
     }

     requestAnimationFrame(() => animate(canvas, ctx, blobs));
 }

 const canvas = document.getElementById("canvas");
 const ctx = canvas.getContext("2d");
 canvas.width = window.innerWidth;
 canvas.height = window.innerHeight;

 const blobs = initializeBlobs(canvas);
 animate(canvas, ctx, blobs);

 // Mouse move interaction
 canvas.addEventListener("mousemove", e => {
     const mouseX = e.clientX;
     const mouseY = e.clientY;
     for (const blob of blobs) {
         const dx = mouseX - blob.x;
         const dy = mouseY - blob.y;
         const distance = Math.sqrt(dx ** 2 + dy ** 2);
         const speed = MAX_SPEED * (1 - distance / canvas.width);
         blob.vx = dx / distance * speed;
         blob.vy = dy / distance * speed;
     }
 });