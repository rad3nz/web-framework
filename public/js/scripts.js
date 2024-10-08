document.addEventListener('DOMContentLoaded', function() {
    // Tambahkan event listener ke semua link di menu admin
    const links = document.querySelectorAll('nav ul li a');
    let currentScript = null; // Variable untuk menyimpan script yang sedang dipakai
  
    function loadScript(src, callback) {
      const script = document.createElement('script');
      script.src = src;
      script.onload = callback;
      script.onerror = function() {
        console.error(`Error loading script: ${src}`);
      };
      document.body.appendChild(script);
    }
    loadScript('./js/session.js?v=' + new Date().getTime(), function() {
      console.log('session.js loaded successfully.')
    });   
    loadScript('./js/utils.js?v=' + new Date().getTime(), function() {
      console.log('utils.js loaded successfully.')
    });   
    loadScript('./js/api.js?v=' + new Date().getTime(), function() {
      console.log('api.js loaded successfully.');
    });  
    loadScript('./js/table.js?v=' + new Date().getTime(), function() {
      console.log('table.js loaded successfully.');
    });
    loadScript('./js/crud.js?v=' + new Date().getTime(), function() {
      console.log('crud.js loaded successfully.');
    });
    
    // Fungsi untuk memuat konten modul
    function loadModuleContent(module) {
      // Gunakan fetch untuk mengambil file data.html dari module yang sesuai
      fetch(`./module/${module}/data.html`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error loading module: ${module}`);
          }
          return response.text();
        })
        .then(data => {
          // Tempatkan konten modul di dalam div dengan id="content"
          document.getElementById('content').innerHTML = data;
  
          // Hapus script modul sebelumnya jika ada
          if (currentScript) {
            document.body.removeChild(currentScript);
          }
          
          // Muat juga script.js dari modul tersebut setelah konten terpasang
          currentScript = document.createElement('script');
          currentScript.src = `./module/${module}/script.js`;
          document.body.appendChild(currentScript);
          
  
        })
        .catch(error => {
          console.error(error);
          document.getElementById('content').innerHTML = `<p>Error loading module ${module}</p>`;
        });
    }
          pagemodule = 'dashboard';
          // Saat halaman pertama kali dimuat, tampilkan modul dashboard sebagai default
          loadModuleContent(pagemodule); 
  
    // Tambahkan event listener untuk setiap link menu
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Dapatkan nama modul dari data-module di elemen <a>
        const module = this.getAttribute('data-module');
        
        // Muat konten HTML untuk modul yang dipilih
        loadModuleContent(module);
      });
    });
  });