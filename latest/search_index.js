var documenterSearchIndex = {"docs": [

{
    "location": "index.html#",
    "page": "Home",
    "title": "Home",
    "category": "page",
    "text": ""
},

{
    "location": "index.html#CUDAnative.jl-1",
    "page": "Home",
    "title": "CUDAnative.jl",
    "category": "section",
    "text": "Support for compiling and executing native Julia kernels on CUDA hardware.This package provides support for compiling and executing native Julia kernels on CUDA hardware. It is a work in progress, and only works on very recent versions of Julia ."
},

{
    "location": "index.html#Installation-1",
    "page": "Home",
    "title": "Installation",
    "category": "section",
    "text": "Requirements:Julia 0.6 with LLVM 3.9 built from source, executed in tree (for LLVM.jl)\nNVIDIA driver, providing libcuda.so (for CUDAdrv.jl)\nCUDA toolkitAlthough that first requirement might sound complicated, it basically means you need to fetch and compile a copy of Julia 0.6 (refer to the main repository's README, checking out the latest tag for 0.6), and execute the resulting julia binary in-place without doing a make install. Afterwards, you can do:Pkg.add(\"CUDAnative\")\nusing CUDAnative\n\n# optionally\nPkg.test(\"CUDAnative\")For now, only Linux and macOS are supported. The build step will discover the available CUDA and LLVM installations, and figure out which devices can be programmed using that set-up. It depends on CUDAdrv and LLVM being properly configured.Even if the build fails, CUDAnative.jl should always be loadable. This simplifies use by downstream packages, until there is proper language support for conditional modules. You can check whether the package has been built properly by inspecting the CUDAnative.configured global variable."
},

{
    "location": "man/usage.html#",
    "page": "Usage",
    "title": "Usage",
    "category": "page",
    "text": ""
},

{
    "location": "man/usage.html#Usage-1",
    "page": "Usage",
    "title": "Usage",
    "category": "section",
    "text": ""
},

{
    "location": "man/usage.html#Quick-start-1",
    "page": "Usage",
    "title": "Quick start",
    "category": "section",
    "text": "First you have to write the kernel function and make sure it only uses features from the CUDA-supported subset of Julia:using CUDAnative\n\nfunction kernel_vadd(a, b, c)\n    i = (blockIdx().x-1) * blockDim().x + threadIdx().x\n    c[i] = a[i] + b[i]\n\n    return nothing\nend\nUsing the @cuda macro, you can launch the kernel on a GPU of your choice:using CUDAdrv, CUDAnative\nusing Base.Test\n\n# CUDAdrv functionality: generate and upload data\na = round.(rand(Float32, (3, 4)) * 100)\nb = round.(rand(Float32, (3, 4)) * 100)\nd_a = CuArray(a)\nd_b = CuArray(b)\nd_c = similar(d_a)  # output array\n\n# run the kernel and fetch results\n# syntax: @cuda (dims...) kernel(args...)\n@cuda (1,12) kernel_vadd(d_a, d_b, d_c)\n\n# CUDAdrv functionality: download data\n# this synchronizes the device\nc = Array(d_c)\n\n@test a+b ≈ cThis code is executed in a default, global context for the first device in your system. The compiler queries the context through CuCurrentContext, which implies you can easily switch contexts (using a different device, or supplying different flags) by activating a different one:dev = CuDevice(0)\nCuContext(dev) do ctx\n    # allocate things in this context\n    @cuda ...\nend"
},

{
    "location": "man/usage.html#Julia-support-1",
    "page": "Usage",
    "title": "Julia support",
    "category": "section",
    "text": "Only a limited subset of Julia is supported by this package. This subset is undocumented, as it is too much in flux.In general, GPU support of Julia code is determined by the language features used by the code. Several parts of the language are downright disallowed, such as calls to the Julia runtime, or garbage allocations. Other features might get reduced in strength, eg. throwing exceptions will result in a trap.If your code is incompatible with GPU execution, the compiler will mention the unsupported feature, and where the use came from:julia> foo(i) = (print(\"can't do this\"); return nothing)\nfoo (generic function with 1 method)\n\njulia> @cuda (1,1) foo(1)\nERROR: error compiling foo: error compiling print: generic call to unsafe_write requires the runtime language featureIn addition, the JIT doesn't support certain modes of compilation. For example, recursive functions require a proper cached compilation, which is currently absent."
},

{
    "location": "man/usage.html#CUDA-support-1",
    "page": "Usage",
    "title": "CUDA support",
    "category": "section",
    "text": "Not all of CUDA is supported, and because of time constraints the supported subset is again undocumented. The following (incomplete) list details the support and their CUDAnative.jl names. Most are implemented in intrinsics.jl, so have a look at that file for a more up to date list:Indexing: threadIdx().{x,y,z}, blockDim(), blockIdx(), gridDim(), warpsize()\nShared memory: @cuStaticSharedMemory, @cuDynamicSharedMemory\nArray type: CuDeviceArray (converted from input CuArrays, or shared memory)\nI/O: @cuprintf\nSynchronization: sync_threads\nCommunication: vote_{all,any,ballot}\nData movement: shfl_{up,down,bfly,idx}"
},

{
    "location": "man/usage.html#libdevice-1",
    "page": "Usage",
    "title": "libdevice",
    "category": "section",
    "text": "In addition to the native intrinsics listed above, math functionality from libdevice is wrapped and part of CUDAnative. For now, you need to fully qualify function calls to these intrinsics, which provide similar functionality to some of the low-level math functionality of Base which would otherwise call out to libm."
},

{
    "location": "man/troubleshooting.html#",
    "page": "Troubleshooting",
    "title": "Troubleshooting",
    "category": "page",
    "text": ""
},

{
    "location": "man/troubleshooting.html#Troubleshooting-1",
    "page": "Troubleshooting",
    "title": "Troubleshooting",
    "category": "section",
    "text": "You can enable verbose logging using two environment variables:DEBUG: if set, enable additional (possibly costly) run-time checks, and some more verbose output\nTRACE: if set, the DEBUG level will be activated, in addition with a trace of every call to the underlying libraryIn order to avoid run-time cost for checking the log level, these flags are implemented by means of global constants. As a result, you need to run Julia with precompilation disabled if you want to modify these flags:$ TRACE=1 julia --compilecache=no examples/vadd.jl\nTRACE: CUDAnative.jl is running in trace mode, this will generate a lot of additional output\n...Enabling colors with --color=yes is also recommended as it color-codes the output."
},

{
    "location": "man/troubleshooting.html#trap-and-kernel-launch-failures-1",
    "page": "Troubleshooting",
    "title": "trap and kernel launch failures",
    "category": "section",
    "text": "Exceptions, like the ones being thrown from out-of-bounds accesses, currently just generate a trap instruction which halts the GPU. This might show up as a kernel launch failure, or an unrelated error in another API call.If the error is thrown from an array access, and an out-of-bounds access is suspected, it is useful to turn of bounds checking (julia --check-bounds=no) and run the Julia process under cuda-memcheck while enabling debug mode 1 (the default value) or higher. This way, cuda-memcheck will be able to accurately pinpoint the out-of-bounds access, while specifying the exact location of the access within the active grid and block."
},

{
    "location": "man/troubleshooting.html#code_*-alternatives-1",
    "page": "Troubleshooting",
    "title": "code_* alternatives",
    "category": "section",
    "text": "CUDAnative provides alternatives to Base's code_llvm and code_native to inspect generated GPU code:julia> foo(a, i) = (a[1] = i; return nothing)\nfoo (generic function with 1 method)\n\njulia> a = CuArray{Int}(1)\n\njulia> CUDAnative.@code_llvm foo(a, 1)\n\n; Function Attrs: nounwind\ndefine i64 @julia_foo_62405(%CuDeviceArray.2* nocapture readonly, i64) {\n...\n}\n\njulia> @code_ptx foo(a, 1)\n.visible .entry julia_foo_62419(\n        .param .u64 julia_foo_62419_param_0,\n        .param .u64 julia_foo_62419_param_1\n)\n{\n...\n}\n\njulia> @code_sass foo(a, 1)\n        code for sm_20\n                Function : julia_foo_62539\n...Non-macro versions of these reflection entry-points are available as well (ie. code_llvm, etc), but as there's type conversions happening behind the scenes you will need to take care and perform those conversions manually:julia> CUDAnative.code_llvm(foo, (CuArray{Int,1},Int))\nERROR: error compiling foo: ...\n\njulia> CUDAnative.code_llvm(foo, (CuDeviceArray{Int,1},Int))\n\n; Function Attrs: nounwind\ndefine i64 @julia_foo_62405(%CuDeviceArray.2* nocapture readonly, i64) {\n...\n}"
},

{
    "location": "man/troubleshooting.html#Debug-info-and-line-number-information-1",
    "page": "Troubleshooting",
    "title": "Debug info and line-number information",
    "category": "section",
    "text": "LLVM's NVPTX back-end does not support the undocumented PTX debug format, so we cannot generate the necessary DWARF sections. This means that debugging generated code with e.g. cuda-gdb will be an unpleasant experience. Nonetheless, the PTX JIT is configured to emit debug info (which corresponds with nvcc -g) when the Julia debug info level is 2 or higher (julia -g2).We do however support emitting line number information, which is useful for other CUDA tools like cuda-memcheck. The functionality (which corresponds with nvcc -lineinfo) is enabled when the Julia debug info level is 1 (the default value) or higher."
},

{
    "location": "man/performance.html#",
    "page": "Performance",
    "title": "Performance",
    "category": "page",
    "text": ""
},

{
    "location": "man/performance.html#Performance-1",
    "page": "Performance",
    "title": "Performance",
    "category": "section",
    "text": "WIP."
},

{
    "location": "lib/compilation.html#",
    "page": "Compilation & Execution",
    "title": "Compilation & Execution",
    "category": "page",
    "text": ""
},

{
    "location": "lib/compilation.html#CUDAnative.@cuda",
    "page": "Compilation & Execution",
    "title": "CUDAnative.@cuda",
    "category": "Macro",
    "text": "@cuda (gridDim::CuDim, blockDim::CuDim, [shmem::Int], [stream::CuStream]) func(args...)\n\nHigh-level interface for calling functions on a GPU, queues a kernel launch on the current context. The gridDim and blockDim arguments represent the launch configuration, the optional shmem parameter specifies how much bytes of dynamic shared memory should be allocated (defaulting to 0), while the optional stream parameter indicates on which stream the launch should be scheduled.\n\nThe func argument should be a valid Julia function. It will be compiled to a CUDA function upon first use, and to a certain extent arguments will be converted and managed automatically (see cudaconvert). Finally, a call to cudacall is performed, scheduling the compiled function for execution on the GPU.\n\n\n\n"
},

{
    "location": "lib/compilation.html#CUDAnative.cudaconvert",
    "page": "Compilation & Execution",
    "title": "CUDAnative.cudaconvert",
    "category": "Function",
    "text": "cudaconvert(x)\n\nThis function is called for every argument to be passed to a kernel, allowing it to be converted to a GPU-friendly format. By default, the function does nothing and returns the input object x as-is.\n\nFor CuArray objects, a corresponding CuDeviceArray object in global space is returned, which implements GPU-compatible array functionality.\n\n\n\n"
},

{
    "location": "lib/compilation.html#CUDAnative.nearest_warpsize",
    "page": "Compilation & Execution",
    "title": "CUDAnative.nearest_warpsize",
    "category": "Function",
    "text": "Return the nearest number of threads that is a multiple of the warp size of a device:\n\nnearest_warpsize(dev::CuDevice, threads::Integer)\n\nThis is a common requirement, eg. when using shuffle intrinsics.\n\n\n\n"
},

{
    "location": "lib/compilation.html#Compilation-and-Execution-1",
    "page": "Compilation & Execution",
    "title": "Compilation & Execution",
    "category": "section",
    "text": "CUDAnative.@cuda\nCUDAnative.cudaconvert\nCUDAnative.nearest_warpsize"
},

{
    "location": "lib/reflection.html#",
    "page": "Reflection",
    "title": "Reflection",
    "category": "page",
    "text": ""
},

{
    "location": "lib/reflection.html#CUDAnative.code_llvm",
    "page": "Reflection",
    "title": "CUDAnative.code_llvm",
    "category": "Function",
    "text": "code_llvm([io], f, types; optimize=true, dump_module=false, cap::VersionNumber)\n\nPrints the LLVM IR generated for the method matching the given generic function and type signature to io which defaults to STDOUT. The IR is optimized according to optimize (defaults to true), and the entire module, including headers and other functions, is dumped if dump_module is set (defaults to false). The device capability cap to generate code for defaults to the current active device's capability, or v\"2.0\" if there is no such active context.\n\n\n\n"
},

{
    "location": "lib/reflection.html#CUDAnative.code_ptx",
    "page": "Reflection",
    "title": "CUDAnative.code_ptx",
    "category": "Function",
    "text": "code_ptx([io], f, types; cap::VersionNumber, kernel::Bool=false)\n\nPrints the PTX assembly generated for the method matching the given generic function and type signature to io which defaults to STDOUT. The device capability cap to generate code for defaults to the current active device's capability, or v\"2.0\" if there is no such active context. The optional kernel parameter indicates whether the function in question is an entry-point function, or a regular device function.\n\n\n\n"
},

{
    "location": "lib/reflection.html#CUDAnative.code_sass",
    "page": "Reflection",
    "title": "CUDAnative.code_sass",
    "category": "Function",
    "text": "code_sass([io], f, types, cap::VersionNumber)\n\nPrints the SASS code generated for the method matching the given generic function and type signature to io which defaults to STDOUT. The device capability cap to generate code for defaults to the current active device's capability, or v\"2.0\" if there is no such active context.\n\nNote that the method needs to be a valid entry-point kernel, ie. it should not return any values.\n\n\n\n"
},

{
    "location": "lib/reflection.html#Reflection-1",
    "page": "Reflection",
    "title": "Reflection",
    "category": "section",
    "text": "Because of using a different compilation toolchain, CUDAnative.jl offers counterpart functions to the code_ functionality from Base:CUDAnative.code_llvm\nCUDAnative.code_ptx\nCUDAnative.code_sass"
},

{
    "location": "lib/reflection.html#CUDAnative.@code_lowered",
    "page": "Reflection",
    "title": "CUDAnative.@code_lowered",
    "category": "Macro",
    "text": "code_lowered\n\nExtracts the relevant function call from any @cuda invocation, evaluates the arguments to the function or macro call, determines their types (taking into account GPU-specific type conversions), and calls code_lowered on the resulting expression. Can be applied to a pure function call, or a call prefixed with the @cuda macro. In that case, kernel code generation conventions are used (wrt. argument conversions, return values, etc).\n\n\n\n"
},

{
    "location": "lib/reflection.html#CUDAnative.@code_typed",
    "page": "Reflection",
    "title": "CUDAnative.@code_typed",
    "category": "Macro",
    "text": "code_typed\n\nExtracts the relevant function call from any @cuda invocation, evaluates the arguments to the function or macro call, determines their types (taking into account GPU-specific type conversions), and calls code_typed on the resulting expression. Can be applied to a pure function call, or a call prefixed with the @cuda macro. In that case, kernel code generation conventions are used (wrt. argument conversions, return values, etc).\n\n\n\n"
},

{
    "location": "lib/reflection.html#CUDAnative.@code_warntype",
    "page": "Reflection",
    "title": "CUDAnative.@code_warntype",
    "category": "Macro",
    "text": "code_warntype\n\nExtracts the relevant function call from any @cuda invocation, evaluates the arguments to the function or macro call, determines their types (taking into account GPU-specific type conversions), and calls code_warntype on the resulting expression. Can be applied to a pure function call, or a call prefixed with the @cuda macro. In that case, kernel code generation conventions are used (wrt. argument conversions, return values, etc).\n\n\n\n"
},

{
    "location": "lib/reflection.html#CUDAnative.@code_llvm",
    "page": "Reflection",
    "title": "CUDAnative.@code_llvm",
    "category": "Macro",
    "text": "code_llvm\n\nExtracts the relevant function call from any @cuda invocation, evaluates the arguments to the function or macro call, determines their types (taking into account GPU-specific type conversions), and calls code_llvm on the resulting expression. Can be applied to a pure function call, or a call prefixed with the @cuda macro. In that case, kernel code generation conventions are used (wrt. argument conversions, return values, etc).\n\n\n\n"
},

{
    "location": "lib/reflection.html#CUDAnative.@code_ptx",
    "page": "Reflection",
    "title": "CUDAnative.@code_ptx",
    "category": "Macro",
    "text": "code_ptx\n\nExtracts the relevant function call from any @cuda invocation, evaluates the arguments to the function or macro call, determines their types (taking into account GPU-specific type conversions), and calls code_ptx on the resulting expression. Can be applied to a pure function call, or a call prefixed with the @cuda macro. In that case, kernel code generation conventions are used (wrt. argument conversions, return values, etc).\n\n\n\n"
},

{
    "location": "lib/reflection.html#CUDAnative.@code_sass",
    "page": "Reflection",
    "title": "CUDAnative.@code_sass",
    "category": "Macro",
    "text": "code_sass\n\nExtracts the relevant function call from any @cuda invocation, evaluates the arguments to the function or macro call, determines their types (taking into account GPU-specific type conversions), and calls code_sass on the resulting expression. Can be applied to a pure function call, or a call prefixed with the @cuda macro. In that case, kernel code generation conventions are used (wrt. argument conversions, return values, etc).\n\n\n\n"
},

{
    "location": "lib/reflection.html#Convenience-macros-1",
    "page": "Reflection",
    "title": "Convenience macros",
    "category": "section",
    "text": "For ease of use, CUDAnative.jl also implements @code_ macros wrapping the above reflection functionality. These macros determines the type of arguments (taking into account GPU type conversions), and call the underlying code_ function. In addition, these functions understand the @cuda invocation syntax, so you conveniently put them in front an existing @cuda invocation.CUDAnative.@code_lowered\nCUDAnative.@code_typed\nCUDAnative.@code_warntype\nCUDAnative.@code_llvm\nCUDAnative.@code_ptx\nCUDAnative.@code_sass"
},

{
    "location": "lib/profiling.html#",
    "page": "Profiling",
    "title": "Profiling",
    "category": "page",
    "text": ""
},

{
    "location": "lib/profiling.html#CUDAnative.@profile",
    "page": "Profiling",
    "title": "CUDAnative.@profile",
    "category": "Macro",
    "text": "@profile ex\n\nRuns your expression ex while activating the CUDA profiler upon first kernel launch. This makes it easier to profile accurately, without the overhead of initial compilation, memory transfers, ...\n\nNote that this API is used to programmatically control the profiling granularity by allowing profiling to be done only on selective pieces of code. It does not perform any profiling on itself, you need external tools for that.\n\n\n\n"
},

{
    "location": "lib/profiling.html#Profiling-1",
    "page": "Profiling",
    "title": "Profiling",
    "category": "section",
    "text": "CUDAnative.@profile"
},

{
    "location": "lib/device/intrinsics.html#",
    "page": "Intrinsics",
    "title": "Intrinsics",
    "category": "page",
    "text": ""
},

{
    "location": "lib/device/intrinsics.html#Intrinsics-1",
    "page": "Intrinsics",
    "title": "Intrinsics",
    "category": "section",
    "text": "This section lists the package's public functionality that corresponds to special CUDA functions to be used in device code. It is loosely organized according to the C language extensions appendix from the CUDA C programming guide. For more information about certain intrinsics, refer to the aforementioned NVIDIA documentation."
},

{
    "location": "lib/device/intrinsics.html#CUDAnative.gridDim",
    "page": "Intrinsics",
    "title": "CUDAnative.gridDim",
    "category": "Function",
    "text": "gridDim()::CuDim3\n\nReturns the dimensions of the grid.\n\n\n\n"
},

{
    "location": "lib/device/intrinsics.html#CUDAnative.blockIdx",
    "page": "Intrinsics",
    "title": "CUDAnative.blockIdx",
    "category": "Function",
    "text": "blockIdx()::CuDim3\n\nReturns the block index within the grid.\n\n\n\n"
},

{
    "location": "lib/device/intrinsics.html#CUDAnative.blockDim",
    "page": "Intrinsics",
    "title": "CUDAnative.blockDim",
    "category": "Function",
    "text": "blockDim()::CuDim3\n\nReturns the dimensions of the block.\n\n\n\n"
},

{
    "location": "lib/device/intrinsics.html#CUDAnative.threadIdx",
    "page": "Intrinsics",
    "title": "CUDAnative.threadIdx",
    "category": "Function",
    "text": "threadIdx()::CuDim3\n\nReturns the thread index within the block. \n\n\n\n"
},

{
    "location": "lib/device/intrinsics.html#CUDAnative.warpsize",
    "page": "Intrinsics",
    "title": "CUDAnative.warpsize",
    "category": "Function",
    "text": "warpsize()::UInt32\n\nReturns the warp size (in threads).\n\n\n\n"
},

{
    "location": "lib/device/intrinsics.html#Indexing-and-Dimensions-1",
    "page": "Intrinsics",
    "title": "Indexing and Dimensions",
    "category": "section",
    "text": "CUDAnative.gridDim\nCUDAnative.blockIdx\nCUDAnative.blockDim\nCUDAnative.threadIdx\nCUDAnative.warpsize"
},

{
    "location": "lib/device/intrinsics.html#Memory-Types-1",
    "page": "Intrinsics",
    "title": "Memory Types",
    "category": "section",
    "text": ""
},

{
    "location": "lib/device/intrinsics.html#CUDAnative.@cuStaticSharedMem",
    "page": "Intrinsics",
    "title": "CUDAnative.@cuStaticSharedMem",
    "category": "Macro",
    "text": "@cuStaticSharedMem(typ::Type, dims) -> CuDeviceArray{typ,Shared}\n\nGet an array of type typ and dimensions dims (either an integer length or tuple shape) pointing to a statically-allocated piece of shared memory. The type should be statically inferable and the dimensions should be constant (without requiring constant propagation, see JuliaLang/julia#5560), or an error will be thrown and the generator function will be called dynamically.\n\nMultiple statically-allocated shared memory arrays can be requested by calling this macro multiple times.\n\n\n\n"
},

{
    "location": "lib/device/intrinsics.html#CUDAnative.@cuDynamicSharedMem",
    "page": "Intrinsics",
    "title": "CUDAnative.@cuDynamicSharedMem",
    "category": "Macro",
    "text": "@cuDynamicSharedMem(typ::Type, dims, offset::Integer=0) -> CuDeviceArray{typ,Shared}\n\nGet an array of type typ and dimensions dims (either an integer length or tuple shape) pointing to a dynamically-allocated piece of shared memory. The type should be statically inferable and the dimension and offset parameters should be constant (without requiring constant propagation, see JuliaLang/julia#5560), or an error will be thrown and the generator function will be called dynamically.\n\nDynamic shared memory also needs to be allocated beforehand, when calling the kernel.\n\nOptionally, an offset parameter indicating how many bytes to add to the base shared memory pointer can be specified. This is useful when dealing with a heterogeneous buffer of dynamic shared memory; in the case of a homogeneous multi-part buffer it is preferred to use view.\n\nNote that calling this macro multiple times does not result in different shared arrays; only a single dynamically-allocated shared memory array exists.\n\n\n\n"
},

{
    "location": "lib/device/intrinsics.html#Shared-Memory-1",
    "page": "Intrinsics",
    "title": "Shared Memory",
    "category": "section",
    "text": "CUDAnative.@cuStaticSharedMem\nCUDAnative.@cuDynamicSharedMem"
},

{
    "location": "lib/device/intrinsics.html#CUDAnative.sync_threads",
    "page": "Intrinsics",
    "title": "CUDAnative.sync_threads",
    "category": "Function",
    "text": "sync_threads()\n\nWaits until all threads in the thread block have reached this point and all global and shared memory accesses made by these threads prior to sync_threads() are visible to all threads in the block.\n\n\n\n"
},

{
    "location": "lib/device/intrinsics.html#Synchronization-1",
    "page": "Intrinsics",
    "title": "Synchronization",
    "category": "section",
    "text": "CUDAnative.sync_threads"
},

{
    "location": "lib/device/intrinsics.html#CUDAnative.vote_all",
    "page": "Intrinsics",
    "title": "CUDAnative.vote_all",
    "category": "Function",
    "text": "vote_all(predicate::Bool)\n\nEvaluate predicate for all active threads of the warp and return non-zero if and only if predicate evaluates to non-zero for all of them.\n\n\n\n"
},

{
    "location": "lib/device/intrinsics.html#CUDAnative.vote_any",
    "page": "Intrinsics",
    "title": "CUDAnative.vote_any",
    "category": "Function",
    "text": "vote_any(predicate::Bool)\n\nEvaluate predicate for all active threads of the warp and return non-zero if and only if predicate evaluates to non-zero for any of them.\n\n\n\n"
},

{
    "location": "lib/device/intrinsics.html#CUDAnative.vote_ballot",
    "page": "Intrinsics",
    "title": "CUDAnative.vote_ballot",
    "category": "Function",
    "text": "vote_ballot(predicate::Bool)\n\nEvaluate predicate for all active threads of the warp and return an integer whose Nth bit is set if and only if predicate evaluates to non-zero for the Nth thread of the warp and the Nth thread is active.\n\n\n\n"
},

{
    "location": "lib/device/intrinsics.html#Warp-Vote-1",
    "page": "Intrinsics",
    "title": "Warp Vote",
    "category": "section",
    "text": "The warp vote functions allow the threads of a given warp to perform a reduction-and-broadcast operation. These functions take as input a boolean predicate from each thread in the warp and evaluate it. The results of that evaluation are combined (reduced) across the active threads of the warp in one different ways, broadcasting a single return value to each participating thread.CUDAnative.vote_all\nCUDAnative.vote_any\nCUDAnative.vote_ballot"
},

{
    "location": "lib/device/intrinsics.html#CUDAnative.shfl",
    "page": "Intrinsics",
    "title": "CUDAnative.shfl",
    "category": "Function",
    "text": "shfl_idx(val, src::Integer, width::Integer=32)\n\nShuffle a value from a directly indexed lane src\n\n\n\n"
},

{
    "location": "lib/device/intrinsics.html#CUDAnative.shfl_up",
    "page": "Intrinsics",
    "title": "CUDAnative.shfl_up",
    "category": "Function",
    "text": "shfl_up(val, src::Integer, width::Integer=32)\n\nShuffle a value from a lane with lower ID relative to caller.\n\n\n\n"
},

{
    "location": "lib/device/intrinsics.html#CUDAnative.shfl_down",
    "page": "Intrinsics",
    "title": "CUDAnative.shfl_down",
    "category": "Function",
    "text": "shfl_down(val, src::Integer, width::Integer=32)\n\nShuffle a value from a lane with higher ID relative to caller.\n\n\n\n"
},

{
    "location": "lib/device/intrinsics.html#CUDAnative.shfl_xor",
    "page": "Intrinsics",
    "title": "CUDAnative.shfl_xor",
    "category": "Function",
    "text": "shfl_xor(val, src::Integer, width::Integer=32)\n\nShuffle a value from a lane based on bitwise XOR of own lane ID.\n\n\n\n"
},

{
    "location": "lib/device/intrinsics.html#Warp-Shuffle-1",
    "page": "Intrinsics",
    "title": "Warp Shuffle",
    "category": "section",
    "text": "CUDAnative.shfl\nCUDAnative.shfl_up\nCUDAnative.shfl_down\nCUDAnative.shfl_xor"
},

{
    "location": "lib/device/intrinsics.html#CUDAnative.@cuprintf",
    "page": "Intrinsics",
    "title": "CUDAnative.@cuprintf",
    "category": "Macro",
    "text": "Print a formatted string in device context on the host standard output:\n\n@cuprintf(\"%Fmt\", args...)\n\nNote that this is not a fully C-compliant printf implementation; see the CUDA documentation for supported options and inputs.\n\nAlso beware that it is an untyped, and unforgiving printf implementation. Type widths need to match, eg. printing a 64-bit Julia integer requires the %ld formatting string.\n\n\n\n"
},

{
    "location": "lib/device/intrinsics.html#Formatted-Output-1",
    "page": "Intrinsics",
    "title": "Formatted Output",
    "category": "section",
    "text": "CUDAnative.@cuprintf"
},

{
    "location": "lib/device/array.html#",
    "page": "Arrays",
    "title": "Arrays",
    "category": "page",
    "text": ""
},

{
    "location": "lib/device/array.html#CUDAnative.CuDeviceArray",
    "page": "Arrays",
    "title": "CUDAnative.CuDeviceArray",
    "category": "Type",
    "text": "CuDeviceArray(dims, ptr)\nCuDeviceArray{T}(dims, ptr)\nCuDeviceArray{T,A}(dims, ptr)\nCuDeviceArray{T,A,N}(dims, ptr)\n\nConstruct an N-dimensional dense CUDA device array with element type T wrapping a pointer, where N is determined from the length of dims and T is determined from the type of ptr. dims may be a single scalar, or a tuple of integers corresponding to the lengths in each dimension). If the rank N is supplied explicitly as in Array{T,N}(dims), then it must match the length of dims. The same applies to the element type T, which should match the type of the pointer ptr.\n\n\n\n"
},

{
    "location": "lib/device/array.html#Arrays-1",
    "page": "Arrays",
    "title": "Arrays",
    "category": "section",
    "text": "CUDAnative provides a primitive, lightweight array type to manage GPU data organized in an plain, dense fashion. This is the device-counterpart to CUDAdrv's CuArray, and implements (part of) the array interface as well as other functionality for use _on_ the GPU:CUDAnative.CuDeviceArray"
},

{
    "location": "lib/device/libdevice.html#",
    "page": "libdevice",
    "title": "libdevice",
    "category": "page",
    "text": ""
},

{
    "location": "lib/device/libdevice.html#libdevice-1",
    "page": "libdevice",
    "title": "libdevice",
    "category": "section",
    "text": "CUDAnative.jl provides wrapper functions for the mathematical routines in libdevice, CUDA's device math library. Many of these functions implement an interface familiar to similar functions in Base, but it is currently impossible to transparently dispatch to these device functions. As a consequence, users should prefix calls to math functions (eg. sin or pow) with the CUDAnative module name.WIP"
},

]}
