/*!

 =========================================================
 * Bootstrap Wizard - v1.1.1
 =========================================================

 * Product Page: https://www.creative-tim.com/product/bootstrap-wizard
 * Copyright 2017 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/bootstrap-wizard/blob/master/LICENSE.md)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// Get Shit Done Kit Bootstrap Wizard Functions

searchVisible = 0;
transparent = true;

$(document).ready(function(){

    /*  Activate the tooltips      */
    $('[rel="tooltip"]').tooltip();

    $.validator.addMethod('regex', function (value, element, regexp) {
        if (regexp.constructor != RegExp)
            regexp = new RegExp(regexp);
        else if (regexp.global)
            regexp.lastIndex = 0;
        return this.optional(element) || regexp.test(value);
    }, 'Please enter a valid Email Address.');

    $.validator.addMethod("number1", function (phone_number, element) {
        phone_number = phone_number.replace(/\s+/g, "");
        return this.optional(element) || phone_number.length > 9 &&
                phone_number.match(/^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/);
    }, 'Please enter a valid mobile number.');

    $.validator.addMethod("pan", function(value, element) {
        return this.optional(element) || /^[A-Z]{5}\d{4}[A-Z]{1}$/.test(value);
    },'Please enter a valid Pan Number. Ex. ABCDE1234F');

    // $.validator.addMethod('filesize', function(value, element, param) {
    // return this.optional(element) || (element.files[0].size <= param);
    // },'File size must be less than 1MB');

    $.validator.addMethod('filesize', function (value, element, param) {
            if(element.files[0].size <= param){
                return true;
            }else{
                return false;
            }
    });

    $.validator.addMethod("accept", function(value, element, param) {
        return value.match(new RegExp("." + param + "$"));
    },'Please select document or pdf file.');

    $.validator.addMethod("lettersonly", function(value, element) {
        // return this.optional(element) || /^[a-z]+$/i.test(value);
        return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
    }, "Please enter only letters.");

    $.validator.addMethod("mynumber", function (value, element) {
            return this.optional(element) || /^\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.[0-9][0-9])?$/.test(value);
        }, "Invalid ctc format.");

    $.validator.addMethod("spellcheck", function (value, element) {
        if($('.objective_msg:visible').length > 0){
            return false;
        }else if($('.summary_msg:visible').length > 0){
            return false;
        }else if($('.prod_msg:visible').length > 0){
            return false;
        }else{
            return true;
        }
    },'');

    // $.validator.addMethod("objmsg", $.validator.methods.required,"Objective is required.");



    // $.validator.addClassRules(
    //         "other_achivements", //your class name
    //         {required: true},
    // );

    

    $.validator.addClassRules({
        qualification: {
            required: true
        },
        stream: {
            required: true
        },
        percentage: {
            required: true,
            number:true,
            range: [1, 100],
            min: 50
        },
        university: {
            required: true,
        },
        college: {
            required: true,
        },
        start_year: {
            required: true,
        },
        end_year: {
            required: true,
        },
        other_achievements: {
            required: true
        },
        technology_name: {
            required: true
        },
        // relevance_year_experience: {
        //     required: true,
        // },
        // relevance_month_experience: {
        //     required: true,
        // },
        company_name: {
            required: true
        },
        project_name: {
            required: true
        },
        project_role: {
            required: true
        },
        tools_used: {
            required: true
        },
        language_used: {
            required: true
        },
        project_description: {
            required: true
        },
        hobbie: {
            required: true
        },
        objectives:{
            required: true,
            // objmsg:true,
            // spellcheck:true,
        },
        summary:{
            required: true,
            // spellcheck:true,
        }
    });

    // $.validator.addClassMessages({
    //     objectives:{
    //         required: "Objective is required.",
    //     },
    // });
    
    // Code for the Validator
    var $validator = $('.wizard-card form').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error',
        errorPlacement: function (error, element) {

            var type = $(element).attr("type");
            // console.log($(element));
            // console.log($(element).attr('class'));
            // console.log($(element).hasClass('form-control end_year ng-pristine ng-untouched ng-valid'));
            if ($(element).attr("id") === "")
            {
                element.parent().append(error);

            } else if ($(element).attr("id") === "qualification")
            {

                element.parent().parent().append(error);
            }
             else if ($(element).attr("id") === "dob")
            {

                element.parent().parent().append(error);
            } else if ($(element).hasClass('start_year'))
            {
                element.parent().parent().parent().append(error);
            // } else if ($(element).attr("class") === "end_year")
            // {

            //     element.parent().parent().parent().append(error);
            }else if ($(element).hasClass('end_year'))
            {
                 element.parent().parent().parent().append(error);
            }else if ($(element).hasClass('qualification'))
            {
                 element.parent().parent().append(error);
            }else if ($(element).attr("id") === "inputFile")
            {

                element.parent().append(error);
            }
            else {
                error.insertAfter(element);
            }
        },

		rules: {
            job_code:{
                required: true,
            },
		    first_name: {
		      required: true,
              lettersonly: true,
              maxlength: 25,
		    },
            middle_name: {
              required: true,
              lettersonly: true,
              maxlength: 25,
            },
            last_name: {
              required: true,
              lettersonly: true,
              maxlength: 25,
            },
            opportunity_for:{
                required: true,
            },
            gender:{
                required:true,
            },
            marital_status:{
                required:true,
            },
		    mobile_no: {
		      required: {
                    depends:function(){
                        $(this).val($.trim($(this).val()).split(" ").join(""));
                        return true;
                    }
                },
                number1: true,
                minlength: 10,
                maxlength: 12,
		    },
		    email: {
		      required: true,
              regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i,
		    },
            dob:{
                required: true,
            },
            pan_number:{
                required: true,
                pan: true,
            },
            corresponding_address:{
                required: true,
            },
            permanent_address:{
                required: true,
                
            },
            // objective:{
            //     required: true,
            //     spellcheck:true,
            // },
            // summary:{
            //     required: true,
            //     spellcheck:true,
            // },
            start_year: {
                required: true,
            },
            end_year: {
                required: true,
            },
            // total_year_experience :{
            //     required: true,
            // },
            // total_month_experience :{
            //     required: true,
            // },
            current_ctc:{
                required: true,
                // number:true,
                mynumber :true  
            },
            // file: {
            //     required: true,
            //     accept: "png|jpe?g|gif",
            //     filesize: 1048576
            // },
            file: {
                required: true,
                accept: "(docx?|doc|pdf)",
                filesize: 1048576
            },
            indian_lang:{
                required: true,
            },
            foreign_lang:{
                required: true,
            }
        },
        messages: {
            job_code:{
                required: "Job code is required.",
            },
            first_name: {
                required: "First name is required.",
                maxlength:"First name cannot exceed more than 25 characters."
                // lettersonly:"Please enter valid name."
            },
            middle_name: {
                required: "Middle name is required.",
                maxlength:"Middle name cannot exceed more than 25 characters."
                // lettersonly:"Please enter valid name."
            },
            last_name: {
                required: "Last name is required.",
                maxlength:"Last name cannot exceed more than 25 characters."
                // lettersonly:"Please enter valid name."
            },
            opportunity_for:{
                required: "Opportunity is required.",
            },
            mobile_no: {
                required: "Mobile number is required.",
            },
            gender:{
                required:"Gender is required",
            },
            marital_status:{
                required:"Marital status is required",
            },
            email: {
                required: "Email is required.",
                contactEmail: "Please enter a valid Email Address.",
                remote: "User email is already taken."
            },
            dob: {
                required: "Date of birth is required.",
            },
            pan_number: {
                required: "PAN number is required.",
            },
            corresponding_address: {
                required: "Correspondence address is required.",
            },
            permanent_address: {
                required: "Permanent address is required.",
            },
            objective: {
                required: "Objective is required.",
            },
            summary: {
                required: "Summary is required.",
            },
            qualification:{
                required: "Qualification is required.",
            },
            stream:{
                required: "Stream is required.",
            },
             percentage:{
                required: "percentage is required.",
                min: "Please enter a value greater than or equal to 50."
            },
            university: {
                required: "University is required.",
            },
            college: {
                required: "College is required.",
            },
            start_year: {
                required: "Startyear is required.",
            },
            end_year: {
                required: "End year is required.",
            },
            other_achievements:{
                required: "Achievements is required.",
            },
            technology_name:{
                required: "Technology is required.",
            },
            // relevance_year_experience:{
            //     required: "Experiance is required.",
            // },
            // relevance_month_experience:{
            //     required: "Experiance is required.",
            // },
            // total_year_experience :{
            //     required: "Total experiance is required",
            // },
            // total_month_experience :{
            //     required: "Total experiance is required",
            // },
            current_ctc:{
                required: "Current CTC is required.",
                // number:"Current CTC is in number",
                // mynumber:"Please enter only two digit after decimal."
            },
            company_name:{
                required: "Company name is required.",
            },
            project_name:{
                required: "Project name is required.",
            },
            project_role:{
                required: "Project role is required.",
            },
            tools_used:{
                required: "Tool name is required.",
            },
            project_description:{
                required: "Project description is required.",
            },
            hobbie:{
                required: "Hobby is required.",
            },
            file: {
                required: "File is required" ,
                accept: "Select document or pdf file",
                filesize: "File size must be less than 1MB"
            }
        },
        highlight: function (element) { // hightlight error inputs
            $(element).closest('.form-group').addClass('has-error');

            $(element).next().children().children().attr('style', 'border-color:#dd4b39!important');
            // set error class to the control group
        },
        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                    .closest('.form-group').removeClass('has-error');
            $(element)
                    .next().children().children().attr('style', 'border-color:'); // set error class to the control group
        },
        success: function (label) {
            label
                    .closest('.form-group').removeClass('has-error'); // set success class to the control group
        }
	});

    // Wizard Initialization


    var scope = angular.element(document.querySelector("#resumeCtrl")).scope();

    
  	$('.wizard-card').bootstrapWizard({
        'tabClass': 'nav nav-pills',
        'nextSelector': '.btn-next',
        'previousSelector': '.btn-previous',

        onNext: function(tab, navigation, index) {

            var $valid = $('.wizard-card form').valid();
            
            if(!$valid) {
                $validator.focusInvalid();                
                return false;
            }  

            // console.log('index',index);
              scope.$apply(function () {
                  scope.backCurrentImg=scope.backImgUrls[index];
                 
              });

        },

        onInit : function(tab, navigation, index){

          //check number of tabs and fill the entire row
          var $total = navigation.find('li').length;
          $width = 100/$total;
          var $wizard = navigation.closest('.wizard-card');

          $display_width = $(document).width();

          if($display_width < 600 && $total > 3){
              $width = 50;
          }

           navigation.find('li').css('width',$width + '%');
           $first_li = navigation.find('li:first-child a').html();
           $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
           $('.wizard-card .wizard-navigation').append($moving_div);
           refreshAnimation($wizard, index);
           $('.moving-tab').css('transition','transform 0s');
        },

        onTabClick : function(tab, navigation, index){


            var $valid = $('.wizard-card form').valid();

            if(!$valid){
                $validator.focusInvalid();         
                return false;
            }

            // console.log('index',index);
            scope.$apply(function () {
                scope.backCurrentImg=scope.backImgUrls[index];
                
            });

        },

        onTabShow: function(tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index+1;

            var $wizard = navigation.closest('.wizard-card');

            // If it's the last tab then hide the last button and show the finish instead
            if($current >= $total) {
                $($wizard).find('.btn-next').hide();
                $($wizard).find('.btn-finish').show();
            } else {
                $($wizard).find('.btn-next').show();
                $($wizard).find('.btn-finish').hide();
            }

            button_text = navigation.find('li:nth-child(' + $current + ') a').html();

            setTimeout(function(){
                $('.moving-tab').text(button_text);
            }, 150);

            var checkbox = $('.footer-checkbox');

            if( !index == 0 ){
                $(checkbox).css({
                    'opacity':'0',
                    'visibility':'hidden',
                    'position':'absolute'
                });
            } else {
                $(checkbox).css({
                    'opacity':'1',
                    'visibility':'visible'
                });
            }

            refreshAnimation($wizard, index);
        },

        onPrevious: function(tab, navigation, index) {
          scope.$apply(function () {
              scope.backCurrentImg=scope.backImgUrls[index];
             
          });
        }
  	});


    // Prepare the preview for profile picture
    $("#wizard-picture").change(function(){
        readURL(this);
    });

    $('[data-toggle="wizard-radio"]').click(function(){
        wizard = $(this).closest('.wizard-card');
        wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
        $(this).addClass('active');
        $(wizard).find('[type="radio"]').removeAttr('checked');
        $(this).find('[type="radio"]').attr('checked','true');
    });

    $('[data-toggle="wizard-checkbox"]').click(function(){
        if( $(this).hasClass('active')){
            $(this).removeClass('active');
            $(this).find('[type="checkbox"]').removeAttr('checked');
        } else {
            $(this).addClass('active');
            $(this).find('[type="checkbox"]').attr('checked','true');
        }
    });

    $('.set-full-height').css('height', 'auto');

});



 //Function to show image before upload

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$(window).resize(function(){
    $('.wizard-card').each(function(){
        $wizard = $(this);
        index = $wizard.bootstrapWizard('currentIndex');
        refreshAnimation($wizard, index);

        $('.moving-tab').css({
            'transition': 'transform 0s'
        });
    });
});

function refreshAnimation($wizard, index){
    total_steps = $wizard.find('li').length;
    move_distance = $wizard.width() / total_steps;
    step_width = move_distance;
    move_distance *= index;

    $wizard.find('.moving-tab').css('width', step_width);
    $('.moving-tab').css({
        'transform':'translate3d(' + move_distance + 'px, 0, 0)',
        'transition': 'all 0.3s ease-out'

    });
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}, wait);
		if (immediate && !timeout) func.apply(context, args);
	};
};
