document.addEventListener("DOMContentLoaded", function () {
    // 1. Data Dummy untuk Dashboard Kantin
    const categories = [
        { id: 'makanan', text: 'Makanan Berat' },
        { id: 'minuman', text: 'Minuman' },
        { id: 'snack', text: 'Snack & Roti' }
    ];

    const productsData = [
        { id: 1, nama: 'Nasi Goreng Spesial', kategori: 'Makanan Berat', harga: 15000, terjual: 120 },
        { id: 2, nama: 'Es Teh Manis', kategori: 'Minuman', harga: 4000, terjual: 300 },
        { id: 3, nama: 'Ayam Geprek', kategori: 'Makanan Berat', harga: 18000, terjual: 95 },
        { id: 4, nama: 'Roti Bakar Coklat', kategori: 'Snack & Roti', harga: 10000, terjual: 60 }
    ];

    const promoData = [
        { emoji: '🔥', judul: 'Paket Hemat Senin', desc: 'Nasi Goreng + Es Teh Manis (Diskon 15%)', tag: 'Diskon', color: 'red' },
        { emoji: '🥤', judul: 'Happy Hour Minuman', desc: 'Semua varian es teh diskon 50% pukul 14.00 - 16.00', tag: 'Promo', color: 'teal' }
    ];

    // 2. Inisialisasi Tom Select untuk Kategori (Multi-select)
    const selectKat = document.getElementById('fKat');
    if (selectKat) {
        categories.forEach(cat => {
            let opt = document.createElement('option');
            opt.value = cat.id;
            opt.textContent = cat.text;
            selectKat.appendChild(opt);
        });

        new TomSelect('#fKat', {
            plugins: ['remove_button'],
            create: false,
            placeholder: 'Pilih kategori...'
        });
    }

    // 3. Inisialisasi Flatpickr untuk Rentang Tanggal
    if (document.getElementById('fDate')) {
        flatpickr("#fDate", {
            mode: "range",
            dateFormat: "Y-m-d",
            locale: "id",
            onChange: function(selectedDates, dateStr) {
                document.getElementById('dRange').textContent = dateStr ? `Periode: ${dateStr}` : '-';
            }
        });
    }

    // 4. Floating UI untuk Tooltip pada Ikon Informasi
    const tooltip = document.getElementById('tooltip');
    const infoButtons = document.querySelectorAll('.kpi .icon-btn');

    function showTooltip(button) {
        const text = button.getAttribute('data-tip');
        if (!text) return;
        tooltip.textContent = text;
        tooltip.style.opacity = '1';

        window.FloatingUIDOM.computePosition(button, tooltip, {
            placement: 'top',
            middleware: [
                window.FloatingUIDOM.offset(6),
                window.FloatingUIDOM.shift()
            ]
        }).then(({x, y}) => {
            Object.assign(tooltip.style, {
                left: `${x}px`,
                top: `${y}px`,
            });
        });
    }

    function hideTooltip() {
        tooltip.style.opacity = '0';
    }

    infoButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => showTooltip(btn));
        btn.addEventListener('mouseleave', hideTooltip);
        btn.addEventListener('focus', () => showTooltip(btn));
        btn.addEventListener('blur', hideTooltip);
    });

    // 5. Inisialisasi Chart.js (Grafik Batang & Donat)
    // Grafik Omzet per Hari (Bar Chart)
    const ctxBar = document.getElementById('cBar');
    if (ctxBar) {
        new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
                datasets: [{
                    label: 'Omzet (Rp)',
                    data: [450000, 600000, 520000, 780000, 890000, 950000],
                    backgroundColor: '#357DE8',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    // Grafik Item per Kategori (Doughnut Chart)
    const ctxDn = document.getElementById('cDn');
    if (ctxDn) {
        new Chart(ctxDn, {
            type: 'doughnut',
            data: {
                labels: ['Makanan Berat', 'Minuman', 'Snack & Roti'],
                datasets: [{
                    data: [215, 300, 60],
                    backgroundColor: ['#357DE8', '#82B536', '#BF63F3']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // 6. Inisialisasi Tabulator untuk Tabel Produk & SweetAlert2 untuk Hapus
    if (document.getElementById('tProd')) {
        const table = new Tabulator("#tProd", {
            data: productsData,
            layout: "fitColumns",
            pagination: "local",
            paginationSize: 5,
            columns: [
                { title: "Nama Produk", field: "nama", widthGrow: 2 },
                { title: "Kategori", field: "kategori" },
                { title: "Harga", field: "harga", formatter: "money", formatterParams: { symbol: "Rp " } },
                { title: "Terjual", field: "terjual", hozAlign: "center" },
                {
                    title: "Aksi",
                    formatter: function(cell) {
                        return `<button class="icon-btn del" type="button" title="Hapus"><svg class="ic" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>`;
                    },
                    width: 70,
                    hozAlign: "center",
                    cellClick: function(e, cell) {
                        const rowData = cell.getRow().getData();
                        
                        // SweetAlert2 Konfirmasi Hapus
                        Swal.fire({
                            title: 'Hapus Produk?',
                            text: `Apakah Anda yakin ingin menghapus "${rowData.nama}"?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Ya, Hapus',
                            cancelButtonText: 'Batal',
                            customClass: {
                                popup: 'ads-modal'
                            }
                        }).then((result) => {
                            if (result.isConfirmed) {
                                cell.getRow().delete();
                                Swal.fire({
                                    toast: true,
                                    position: 'top-end',
                                    icon: 'success',
                                    title: 'Produk berhasil dihapus',
                                    showConfirmButton: false,
                                    timer: 2000,
                                    customClass: { popup: 'ads-flag' }
                                });
                            }
                        });
                    }
                }
            ],
        });
        
        document.getElementById('tCount').textContent = `${productsData.length} item`;
    }

    // 7. Render Daftar Promo Minggu Ini
    const promoList = document.getElementById('promo');
    if (promoList) {
        promoData.forEach(item => {
            let li = document.createElement('li');
            li.innerHTML = `
                <div class="p-emoji">${item.emoji}</div>
                <div class="p-body">
                    <b>${item.judul}</b>
                    <small>${item.desc}</small>
                </div>
                <span class="lozenge ${item.color}">${item.tag}</span>
            `;
            promoList.appendChild(li);
        });
        document.getElementById('pCount').textContent = `${promoData.length} aktif`;
    }

    // 8. Toggle Mode Gelap / Terang (Dark/Light Mode)
    const btnTheme = document.getElementById('btnTheme');
    if (btnTheme) {
        btnTheme.addEventListener('click', function() {
            const currentMode = document.documentElement.getAttribute('data-color-mode');
            const newMode = currentMode === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-color-mode', newMode);
            localStorage.setItem('kantin-color-mode', newMode);
            btnTheme.querySelector('span').textContent = newMode === 'dark' ? 'Mode terang' : 'Mode gelap';
        });
    }

    // Set nilai awal KPI ringkasan
    document.getElementById('kOmzet').textContent = 'Rp 3.840.000';
    document.getElementById('kItem').textContent = '575';
    document.getElementById('kTrx').textContent = '142';
}); 