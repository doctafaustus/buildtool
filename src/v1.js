import testFunc from './mods/test-func';
import css from './styles/v1.scss';

$('head').append(`<style>${css}</style>`);


function test() {
 return 2;
}



testFunc();
test();
