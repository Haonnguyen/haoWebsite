document.addEventListener('DOMContentLoaded', function() {
    // Branch selection functionality
    const branchItems = document.querySelectorAll('.branch-item');
    let selectedBranch = null;

    branchItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove selected class from all branches
            branchItems.forEach(branch => branch.classList.remove('selected'));
            
            // Add selected class to clicked branch
            this.classList.add('selected');
            selectedBranch = this;
            
            // Update filter indicator
            updateFilterStatus('branch', true);
        });
    });

    // Date tab selection
    const dateTabs = document.querySelectorAll('.date-tab');
    let selectedDate = null;

    dateTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all date tabs
            dateTabs.forEach(dateTab => dateTab.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            selectedDate = this;
            
            // Generate time slots for selected date
            generateTimeSlots();
            
            // Update filter indicator
            updateFilterStatus('date', true);
        });
    });

    // Time slot selection
    let selectedTimeSlot = null;

    function generateTimeSlots() {
        const timeSlots = document.querySelectorAll('.time-slot');
        
        timeSlots.forEach(slot => {
            // Remove previous event listeners by cloning
            const newSlot = slot.cloneNode(true);
            slot.parentNode.replaceChild(newSlot, slot);
        });

        // Re-select time slots after regeneration
        const newTimeSlots = document.querySelectorAll('.time-slot');
        
        newTimeSlots.forEach(slot => {
            slot.addEventListener('click', function() {
                if (this.classList.contains('unavailable')) {
                    return; // Don't allow selection of unavailable slots
                }
                
                // Remove selected class from all time slots
                newTimeSlots.forEach(timeSlot => timeSlot.classList.remove('selected'));
                
                // Add selected class to clicked slot
                this.classList.add('selected');
                selectedTimeSlot = this;
                
                // Update filter indicator
                updateFilterStatus('time', true);
            });
        });
    }

    // Initialize time slot functionality
    generateTimeSlots();

    // Calendar navigation
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    
    prevBtn.addEventListener('click', function() {
        // Logic to navigate to previous week
        console.log('Previous week');
        generateRandomAvailability();
    });
    
    nextBtn.addEventListener('click', function() {
        // Logic to navigate to next week
        console.log('Next week');
        generateRandomAvailability();
    });

    // Generate random availability for demonstration
    function generateRandomAvailability() {
        const timeSlots = document.querySelectorAll('.time-slot');
        
        timeSlots.forEach(slot => {
            // Remove all status classes
            slot.classList.remove('unavailable', 'selected');
            
            // Randomly make some slots unavailable
            if (Math.random() < 0.2) { // 20% chance of being unavailable
                slot.classList.add('unavailable');
            }
        });
    }

    // Initialize with some random unavailable slots
    generateRandomAvailability();

    // Form input validation
    const phoneInput = document.querySelector('input[placeholder="Số điện thoại"]');
    const nameInput = document.querySelector('input[placeholder="Họ và tên"]');
    const serviceInput = document.querySelector('.service-input');

    function validatePhone(phone) {
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        return phoneRegex.test(phone);
    }

    phoneInput.addEventListener('input', function() {
        const isValid = validatePhone(this.value);
        updateFilterStatus('phone', isValid && this.value.length > 0);
        
        if (this.value.length > 0 && !isValid) {
            this.style.borderColor = '#ff4444';
        } else {
            this.style.borderColor = '#e0e0e0';
        }
    });

    nameInput.addEventListener('input', function() {
        updateFilterStatus('name', this.value.trim().length > 0);
    });

    serviceInput.addEventListener('input', function() {
        updateFilterStatus('service', this.value.trim().length > 0);
    });

    // Update filter status indicators
    function updateFilterStatus(type, isComplete) {
        const filterItems = document.querySelectorAll('.filter-item');
        
        filterItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            
            if ((type === 'phone' && text.includes('số điện thoại')) ||
                (type === 'branch' && text.includes('chi nhánh')) ||
                (type === 'service' && text.includes('dịch vụ')) ||
                (type === 'date' && text.includes('ngày giờ')) ||
                (type === 'time' && text.includes('ngày giờ'))) {
                
                if (isComplete) {
                    item.classList.add('active');
                } else if (type !== 'time') { // Don't remove active for time if date is still selected
                    item.classList.remove('active');
                }
            }
        });
    }

    // Form submission
    const submitBtn = document.querySelector('.btn-primary');
    
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Validate all required fields
        const phone = phoneInput.value.trim();
        const name = nameInput.value.trim();
        const service = serviceInput.value.trim();
        
        const errors = [];
        
        if (!phone) {
            errors.push('Vui lòng nhập số điện thoại');
        } else if (!validatePhone(phone)) {
            errors.push('Số điện thoại không hợp lệ');
        }
        
        if (!name) {
            errors.push('Vui lòng nhập họ và tên');
        }
        
        if (!selectedBranch) {
            errors.push('Vui lòng chọn chi nhánh');
        }
        
        if (!service) {
            errors.push('Vui lòng nhập dịch vụ muốn làm');
        }
        
        if (!selectedDate) {
            errors.push('Vui lòng chọn ngày');
        }
        
        if (!selectedTimeSlot) {
            errors.push('Vui lòng chọn giờ');
        }
        
        if (errors.length > 0) {
            alert('Vui lòng hoàn thành các thông tin sau:\n\n' + errors.join('\n'));
            return;
        }
        
        // Show success message
        const bookingData = {
            phone: phone,
            name: name,
            branch: selectedBranch.querySelector('h4').textContent,
            service: service,
            date: selectedDate.querySelector('.date').textContent,
            time: selectedTimeSlot.textContent
        };
        
        showBookingConfirmation(bookingData);
    });

    // Show booking confirmation modal
    function showBookingConfirmation(data) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            text-align: center;
        `;
        
        modalContent.innerHTML = `
            <h2 style="color: #28a745; margin-bottom: 20px;">✅ Đặt Lịch Thành Công!</h2>
            <div style="text-align: left; margin: 20px 0;">
                <p><strong>Họ tên:</strong> ${data.name}</p>
                <p><strong>Số điện thoại:</strong> ${data.phone}</p>
                <p><strong>Chi nhánh:</strong> ${data.branch}</p>
                <p><strong>Dịch vụ:</strong> ${data.service}</p>
                <p><strong>Ngày:</strong> ${data.date}</p>
                <p><strong>Giờ:</strong> ${data.time}</p>
            </div>
            <p style="margin: 20px 0; color: #666;">
                Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận lịch hẹn.
            </p>
            <button onclick="this.closest('.modal').remove()" 
                    style="background: #28a745; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                Đóng
            </button>
        `;
        
        modal.className = 'modal';
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Service autocomplete suggestions (demo)
    const services = [
        'Điều trị mụn',
        'Chăm sóc da mặt',
        'Massage thư giãn',
        'Làm móng',
        'Gội đầu dưỡng sinh',
        'Triệt lông',
        'Điều trị nám',
        'Chăm sóc da toàn thân',
        'Phun xăm lông mày',
        'Nâng cơ mặt'
    ];

    serviceInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        
        // Remove existing suggestions
        const existingSuggestions = document.querySelector('.service-suggestions');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }
        
        if (value.length < 2) return;
        
        const matchingServices = services.filter(service => 
            service.toLowerCase().includes(value)
        );
        
        if (matchingServices.length > 0) {
            const suggestions = document.createElement('div');
            suggestions.className = 'service-suggestions';
            suggestions.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 2px solid #e0e0e0;
                border-top: none;
                border-radius: 0 0 8px 8px;
                max-height: 200px;
                overflow-y: auto;
                z-index: 100;
            `;
            
            matchingServices.forEach(service => {
                const suggestion = document.createElement('div');
                suggestion.textContent = service;
                suggestion.style.cssText = `
                    padding: 12px 15px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                `;
                
                suggestion.addEventListener('click', function() {
                    serviceInput.value = service;
                    suggestions.remove();
                    updateFilterStatus('service', true);
                });
                
                suggestion.addEventListener('mouseenter', function() {
                    this.style.background = '#f8f9fa';
                });
                
                suggestion.addEventListener('mouseleave', function() {
                    this.style.background = 'white';
                });
                
                suggestions.appendChild(suggestion);
            });
            
            serviceInput.parentNode.style.position = 'relative';
            serviceInput.parentNode.appendChild(suggestions);
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        const suggestions = document.querySelector('.service-suggestions');
        if (suggestions && !serviceInput.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.remove();
        }
    });

    // Smooth scroll to sections when clicking filter items
    const filterItems = document.querySelectorAll('.filter-item');
    
    filterItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.textContent.toLowerCase();
            let targetSection = null;
            
            if (text.includes('số điện thoại')) {
                targetSection = document.querySelector('input[placeholder="Số điện thoại"]');
            } else if (text.includes('chi nhánh')) {
                targetSection = document.querySelector('.branch-grid');
            } else if (text.includes('dịch vụ')) {
                targetSection = document.querySelector('.service-input');
            } else if (text.includes('ngày giờ')) {
                targetSection = document.querySelector('.datetime-section');
            }
            
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                
                // Focus input if it's an input field
                if (targetSection.tagName === 'INPUT') {
                    setTimeout(() => targetSection.focus(), 500);
                }
            }
        });
    });

    console.log('HASAKI booking form initialized successfully!');
});