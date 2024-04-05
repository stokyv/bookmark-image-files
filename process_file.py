import subprocess

# def run_cmd():
#     # Run the "node server.js" command
#     subprocess.run(["node", "server.js"], check=True)


if __name__ == "__main__":
    print("Processing bookmarked files...")
    # type in name of zip file
    fname = input('File name:')
    image_folder = extract_zip(fname)
    selected_images_list = load_selected_images()
    bookmarked_images = selected_images_list
    convert_to_relative_filepaths('ch26', bookmarked_images)
    chapters = split_chapters(fname, bookmarked_images)

    chapter_index = 0
    for chapter in chapters:
        #create a new folder for each chapter
        chapter_folder = f"{image_folder}-story-{chapter_index}"
        chapter_index += 1
        new_folder_path = create_new_folder(image_folder, chapter_folder)    
        #move files into folder
        move_files(chapter, new_folder_path)

