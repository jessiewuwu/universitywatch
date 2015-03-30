var print_comparison_chart = function() {
    var twoColComp = {
        init: function() {
            var tables = document.getElementsByTagName('table');

            // for each table
            for (var i = 0; i < tables.length; i++) {
                // don't process one that's already been done (has class two-column-comp)
                if (new RegExp('(^| )two-column-comp( |$)', 'gi').test(tables[i].className)) {
                    return;
                }

                //TODO: need to verify cross-browser support of these vars
                var h = tables[i].clientHeight,
                    t = tables[i].getBoundingClientRect().top,
                    wT = window.pageYOffset || document.documentElement.scrollTop,
                    wH = window.innerHeight;

                if (wT + wH > t + h / 2) {
                    this.make(tables[i]);
                }
            }
        },

        make: function(el) {
            var rows = el.getElementsByTagName('tr'),
                vals = [],
                max,
                percent;

            // for each row in the table, get vals
            for (var x = 0; x < rows.length; x++) {
                var cells = rows[x].getElementsByTagName('td');
                for (var y = 1; y < cells.length; y++) {
                    vals.push(parseInt(cells[y].innerHTML, 10));
                }
            }

            max = Math.max.apply(Math, vals);
            percent = 100 / max;

            //for each row in the table, apply vals
            for (x = 0; x < rows.length; x++) {
                var cells = rows[x].getElementsByTagName('td');
                for (var y = 1; y < cells.length; y++) {
                    var currNum = parseInt(cells[y].innerHTML, 10);
                    cells[y].style.backgroundSize = percent * currNum + "% 100%";
                    cells[y].style.transitionDelay = x / 20 + "s";
                }
            }
            //add a class so you don't process it a bunch of times
            el.className = +" two-column-comp"
        } // end make
    }

    window.onload = function() {
        console.log('success');
        twoColComp.init();
    }

    window.onscroll = function() {
        twoColComp.init();
    }
}


$(function() {
    $('#compare_btn').on('click', function() {
        var firstSchool = $('#first-school').val();
        var secondSchool = $('#second-school').val();

        $.ajax({
            url: '/schools/compare_two',
            type: 'GET',
            dataType: 'json',
            data: {
                first_school: firstSchool,
                second_school: secondSchool
            }
        })
            .done(function(response) {
                console.log(response);
                var table_content = $('.table_eleven');
                var table_content_2012 = $('.table_twelf');
                var table_content_2013 = $('.table_thirteen');

                var school_first_2011 = response.first_school[0];
                var school_second_2011 = response.second_school[0];

                var table_cells = '<table class="table_eleven"><tr><th></th><th>' + firstSchool + '</th><th>' + secondSchool + '</th></tr><tr><td>Aggravated Assault</td><td>' + school_first_2011["ag_assault"] + '</td><td>' + school_second_2011["ag_assault"] + '</td></tr><tr><td>Arson</td><td>' + school_first_2011["arson"] + '</td><td>' + school_second_2011["arson"] + '</td></tr><tr><td>Motor Vehicle Theft</td><td>' + school_first_2011["auto_theft"] + '</td><td>' + school_second_2011["auto_theft"] + '</td></tr><tr><td>Burglary</td><td>' + school_first_2011["burglary"] + '</td><td>' + school_second_2011["burglary"] + '</td></tr><tr><td>Sex Offenses - Forcible</td><td>' + school_first_2011["f_sex"] + '</td><td>' + school_second_2011["f_sex"] + '</td></tr><tr><td>Manslaughter</td><td>' + school_first_2011["manslaughter"] + '</td><td>' + school_second_2011["manslaughter"] + '</td></tr><tr><td>Murder</td><td>' + school_first_2011["murder"] + '</td><td>' + school_second_2011["murder"] + '</td></tr><tr><td>Sex Offenses - Non-forcible</td><td>' + school_first_2011["nf_sex"] + '</td><td>' + school_second_2011["nf_sex"] + '</td></tr><tr><td>Robbery</td><td>' + school_first_2011["robbery"] + '</td><td>' + school_second_2011["robbery"] + '</td></tr></table>';

                table_content.append(table_cells);
                print_comparison_chart();
            })
            .fail(function() {
                console.log("error");
            })

    });


})
