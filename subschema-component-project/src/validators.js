import validateNpmPkgName from 'validate-npm-package-name'
export function npm_validate(options) {
    options = options || {};
    if (!options.message) {
        options.message = "Invalid Package Name"
    }
    if (!options.validType) {
        options.validType = 'validForNewPackages'
    }
    return function package_name$validator(value) {
        if (!validateNpmPkgName(value)[options.validType]) {
            return {
                message: options.message
            }
        }
    }
}

export default  ({
    npm_validate
})
