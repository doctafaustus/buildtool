import testFunc from './mods/test-func';
import css from './styles/v1.scss';

$('head').append(`<style>${css}</style>`);

console.log('test');

var x = '1';
var foo_;

function test(x) {
	console.log(x);
}

const yoyo = 123;
console.log(yoyo);


test(x);

testFunc();