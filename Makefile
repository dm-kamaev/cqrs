publish:
	npm publish --access public

check_correctness:
	npx tsc --noEmit

build:
	rm -rf dist;
	npx tsc

.PHONY: test