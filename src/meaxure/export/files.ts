// Copyright 2020 Jebbs. All rights reserved.
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE file.

import { SMExportFormat } from "../interfaces";
import { sketch } from "../../sketch";
import { context } from "../common/context";
import { toJSString } from "../helpers/helper";

export function exportImage(layer: Layer, format: SMExportFormat, path: string, name: string) {
    let document = context.sketchObject.document;
    let slice = MSExportRequest.exportRequestsFromExportableLayer(layer.sketchObject).firstObject();
    let savePathName = [];

    slice.scale = format.scale;
    slice.format = format.format;

    savePathName.push(
        path,
        "/",
        format.prefix,
        name,
        format.suffix,
        ".",
        format.format
    );
    let savePath = savePathName.join("");

    document.saveArtboardOrSlice_toFile(slice, savePath);
    return savePath;
}

export function exportImageToBuffer(layer: Layer, format: SMExportFormat): Buffer {
    return sketch.export(layer, {
        output: null,
        formats: format.format,
        scales: format.scale.toString(),
    }) as Buffer;
}

export function writeFile(options) {

    options = Object.assign({
        content: "Type something!",
        path: toJSString(NSTemporaryDirectory()),
        fileName: "temp.txt"
    }, options)
    let content = NSString.stringWithString(options.content),
        savePathName = [];

    NSFileManager
        .defaultManager()
        .createDirectoryAtPath_withIntermediateDirectories_attributes_error(options.path, true, nil, nil);

    savePathName.push(
        options.path,
        "/",
        options.fileName
    );
    let savePath = savePathName.join("");

    content.writeToFile_atomically_encoding_error(savePath, false, 4, null);
}

export function buildTemplate(content, data) {
    content = content.replace(new RegExp("\\<\\!\\-\\-\\s([^\\s\\-\\-\\>]+)\\s\\-\\-\\>", "gi"), function ($0, $1) {
        if ($1 in data) {
            return data[$1];
        } else {
            return $0;
        }
    });
    return content;
}